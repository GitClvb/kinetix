package com.kinetix.fit.service;

import com.kinetix.fit.dto.PedidoRequest;
import com.kinetix.fit.dto.PedidoResponse;
import com.kinetix.fit.enums.EstadoPago;
import com.kinetix.fit.enums.EstadoPedido;
import com.kinetix.fit.enums.MetodoPago;
import com.kinetix.fit.model.*;
import com.kinetix.fit.model.CarritoProducto.EstadoItem;
import com.kinetix.fit.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PedidoService {

    private final UsuarioRepository            usuarioRepository;
    private final DireccionUsuarioRepository   direccionRepository;
    private final PedidoRepository             pedidoRepository;
    private final PedidoProductoRepository     pedidoProductoRepository;
    private final PagoRepository               pagoRepository;
    private final CarritoRepository            carritoRepository;
    private final CarritoProductoRepository    carritoProductoRepository;

    public PedidoService(UsuarioRepository usuarioRepository,
                         DireccionUsuarioRepository direccionRepository,
                         PedidoRepository pedidoRepository,
                         PedidoProductoRepository pedidoProductoRepository,
                         PagoRepository pagoRepository,
                         CarritoRepository carritoRepository,
                         CarritoProductoRepository carritoProductoRepository) {
        this.usuarioRepository         = usuarioRepository;
        this.direccionRepository       = direccionRepository;
        this.pedidoRepository          = pedidoRepository;
        this.pedidoProductoRepository  = pedidoProductoRepository;
        this.pagoRepository            = pagoRepository;
        this.carritoRepository         = carritoRepository;
        this.carritoProductoRepository = carritoProductoRepository;
    }

    @Transactional
    public PedidoResponse crearPedido(Integer idUsuario, PedidoRequest request) {

        // Agregamos el Usuario
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + idUsuario));

        DireccionUsuario direccion = new DireccionUsuario();
        direccion.setUsuario(usuario);
        direccion.setNombreDestinatario(request.getNombreDestinatario());
        direccion.setCalle(request.getCalle());
        direccion.setNumeroExterior(request.getNumeroExterior() != null
                ? request.getNumeroExterior() : "S/N");
        // Usamos ciudad como colonia si no viene campo separado
        direccion.setColonia(request.getColonia() != null
                ? request.getColonia() : request.getCiudad());
        direccion.setEstado(request.getEstado());
        direccion.setCodigoPostal(request.getCodigoPostal());
        direccion.setPais(request.getPais());
        direccion = direccionRepository.save(direccion);

        // paraproductos activos del carrito
        Carrito carrito = carritoRepository.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("El usuario no tiene carrito activo."));

        List<CarritoProducto> itemsActivos =
                carritoProductoRepository.findByCarritoAndEstado(carrito, EstadoItem.ACTIVO);

        if (itemsActivos.isEmpty()) {
            throw new RuntimeException("No hay ítems activos en el carrito para procesar.");
        }

        // calcula total
        BigDecimal total = itemsActivos.stream()
                .map(item -> item.getPrecioUnitario()
                        .multiply(BigDecimal.valueOf(item.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // crea pedido
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setDireccion(direccion);
        pedido.setTotal(total);
        pedido.setEstado(EstadoPedido.pagado);
        pedido.setFechaPedido(LocalDateTime.now());
        pedido = pedidoRepository.save(pedido);

        //copia los productos a pedido_productos
        for (CarritoProducto item : itemsActivos) {
            BigDecimal subtotal = item.getPrecioUnitario()
                    .multiply(BigDecimal.valueOf(item.getCantidad()));

            PedidoProducto pp = new PedidoProducto();
            pp.setPedido(pedido);
            pp.setVariante(item.getVariante());
            pp.setCantidad(item.getCantidad());
            pp.setPrecioUnitario(item.getPrecioUnitario());
            pp.setSubtotal(subtotal);
            pedidoProductoRepository.save(pp);
        }

        // ── 7. Registrar Pago ─────────────────────────────────────────────────
        MetodoPago metodoPago = request.getMetodoPago() != null
                ? request.getMetodoPago()
                : MetodoPago.tarjeta;

        Pago pago = new Pago();
        pago.setPedido(pedido);
        pago.setMetodoPago(metodoPago);
        pago.setEstadoPago(EstadoPago.aprobado);     // simulación: siempre aprobado
        pago.setReferencia("SIM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        pago.setFechaPago(LocalDateTime.now());
        pago = pagoRepository.save(pago);

        //modificamos el estado del pdido
        carritoProductoRepository.archivarItemsDeCarrito(
                carrito,
                EstadoItem.ACTIVO,
                EstadoItem.PROCESADO
        );

        return new PedidoResponse(
                pedido.getIdPedido(),
                pago.getIdPago(),
                total,
                pedido.getEstado().name(),
                pago.getEstadoPago().name(),
                pedido.getFechaPedido()
        );
    }
}