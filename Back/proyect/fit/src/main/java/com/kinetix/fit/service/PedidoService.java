package com.kinetix.fit.service;

import com.kinetix.fit.enums.EstadoPedido;
import com.kinetix.fit.exception.ResourceNotFoundException;
import com.kinetix.fit.model.*;
import com.kinetix.fit.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final PedidoProductoRepository pedidoProductoRepository;
    private final CarritoRepository carritoRepository;
    private final CarritoProductoRepository carritoProductoRepository;
    private final UsuarioRepository usuarioRepository;
    private final DireccionUsuarioRepository direccionUsuarioRepository;

    public PedidoService(
            PedidoRepository pedidoRepository,
            PedidoProductoRepository pedidoProductoRepository,
            CarritoRepository carritoRepository,
            CarritoProductoRepository carritoProductoRepository,
            UsuarioRepository usuarioRepository,
            DireccionUsuarioRepository direccionUsuarioRepository
    ) {
        this.pedidoRepository = pedidoRepository;
        this.pedidoProductoRepository = pedidoProductoRepository;
        this.carritoRepository = carritoRepository;
        this.carritoProductoRepository = carritoProductoRepository;
        this.usuarioRepository = usuarioRepository;
        this.direccionUsuarioRepository = direccionUsuarioRepository;
    }

    //Crear pedido a partir del carrito.
    public Pedido crearPedido(Integer idUsuario, Integer idDireccion) {

        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(() ->
                new ResourceNotFoundException("Usuario no encontrado"));

        DireccionUsuario direccion = direccionUsuarioRepository.findById(idDireccion).orElseThrow(() ->
                                new ResourceNotFoundException("Dirección no encontrada"));

        Carrito carrito = carritoRepository.findByUsuarioIdUsuario(idUsuario).orElseThrow(() ->
                                new ResourceNotFoundException("Carrito no encontrado"));

        List<CarritoProducto> items = carritoProductoRepository.findByCarritoIdCarrito(carrito.getIdCarrito());

        if (items.isEmpty()) {
            throw new ResourceNotFoundException("El carrito está vacío");
        }
        BigDecimal total = BigDecimal.ZERO;

        for (CarritoProducto item : items) {

            BigDecimal cantidad = BigDecimal.valueOf(item.getCantidad());

            BigDecimal subtotal = item.getPrecioUnitario().multiply(cantidad);

            total = total.add(subtotal);
        }

        Pedido pedido = new Pedido();

        pedido.setUsuario(usuario);
        pedido.setDireccion(direccion);
        pedido.setEstado(EstadoPedido.pendiente);
        pedido.setFechaPedido(LocalDateTime.now());
        pedido.setTotal(total);

        pedido = pedidoRepository.save(pedido);

        for (CarritoProducto item : items) {

            PedidoProducto detalle =
                    new PedidoProducto();

            detalle.setPedido(pedido);
            detalle.setVariante(item.getVariante());
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(
                    item.getPrecioUnitario()
            );

            BigDecimal cantidad = BigDecimal.valueOf(item.getCantidad());

            BigDecimal subtotal = item.getPrecioUnitario().multiply(cantidad);

            detalle.setSubtotal(subtotal);

            pedidoProductoRepository.save(detalle);
        }

        carritoProductoRepository.deleteByCarritoIdCarrito(
                carrito.getIdCarrito()
        );

        return pedido;
    }

    // Listar todos los pedidos
    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    // Buscar pedido por id
    public Pedido buscarPorId(Integer id) {
        return pedidoRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Pedido no encontrado"));
    }

    //Historial prdido
    public List<Pedido> historialUsuario(Integer idUsuario) {
        return pedidoRepository.findByUsuarioIdUsuario(
                idUsuario
        );
    }

    //Obtener detalle del pedido
    public List<PedidoProducto> obtenerDetalle(Integer idPedido) {
        buscarPorId(idPedido);
        return pedidoProductoRepository.findByPedidoIdPedido(idPedido);
    }

    //Actualizar estado del pedido
    public Pedido actualizarEstado(Integer idPedido, EstadoPedido estado) {

        Pedido pedido = buscarPorId(idPedido);

        pedido.setEstado(estado);

        return pedidoRepository.save(pedido);
    }


}
