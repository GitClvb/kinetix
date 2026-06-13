package com.kinetix.fit.service;

import com.kinetix.fit.dto.AgregarItemRequest;
import com.kinetix.fit.dto.CarritoItemResponse;
import com.kinetix.fit.model.Carrito;
import com.kinetix.fit.model.CarritoProducto;
import com.kinetix.fit.model.CarritoProducto.EstadoItem;
import com.kinetix.fit.model.ProductoColor;
import com.kinetix.fit.model.Usuario;
import com.kinetix.fit.model.Variante;
import com.kinetix.fit.model.VarianteImagen;
import com.kinetix.fit.repository.CarritoProductoRepository;
import com.kinetix.fit.repository.CarritoRepository;
import com.kinetix.fit.repository.UsuarioRepository;
import com.kinetix.fit.repository.VarianteImagenRepository;
import com.kinetix.fit.repository.VarianteRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CarritoService {

    private final CarritoRepository          carritoRepository;
    private final CarritoProductoRepository  carritoProductoRepository;
    private final UsuarioRepository          usuarioRepository;
    private final VarianteRepository         varianteRepository;
    private final VarianteImagenRepository   varianteImagenRepository;

    public CarritoService(CarritoRepository carritoRepository,
                          CarritoProductoRepository carritoProductoRepository,
                          UsuarioRepository usuarioRepository,
                          VarianteRepository varianteRepository,
                          VarianteImagenRepository varianteImagenRepository) {
        this.carritoRepository         = carritoRepository;
        this.carritoProductoRepository = carritoProductoRepository;
        this.usuarioRepository         = usuarioRepository;
        this.varianteRepository        = varianteRepository;
        this.varianteImagenRepository  = varianteImagenRepository;
    }

    // Obtener o crear carrito del usuario
    private Carrito obtenerOCrearCarrito(Integer idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + idUsuario));

        return carritoRepository.findByUsuario(usuario)
                .orElseGet(() -> {
                    Carrito nuevo = new Carrito();
                    nuevo.setUsuario(usuario);
                    nuevo.setFechaCreacion(LocalDateTime.now());
                    return carritoRepository.save(nuevo);
                });
    }

    // construir CarritoItemResponse con imagen, talla y color
    private CarritoItemResponse toResponse(CarritoProducto item) {
        Variante     variante     = item.getVariante();
        ProductoColor productoColor = variante.getProductoColor();

        List<VarianteImagen> imagenes =
                varianteImagenRepository.findByProductoColor_IdProductoColor(
                        productoColor.getIdProductoColor()
                );
        String imagen = imagenes.isEmpty() ? "" : imagenes.get(0).getUrlImagen();
        String talla = variante.getTalla().getNombre();
        String codigoColor = productoColor.getColor().getCodigoHex();

        return new CarritoItemResponse(
                item.getIdItem(),
                variante.getIdVariante(),
                productoColor.getProducto().getNombre(),
                item.getCantidad(),
                item.getPrecioUnitario(),
                imagen,
                talla,
                codigoColor
        );
    }

    @Transactional
    public CarritoItemResponse agregarItem(Integer idUsuario, AgregarItemRequest request) {

        Carrito carrito = obtenerOCrearCarrito(idUsuario);

        Variante variante = varianteRepository.findById(request.getIdVariante())
                .orElseThrow(() -> new RuntimeException("Variante no encontrada: " + request.getIdVariante()));

        if (variante.getStock() < request.getCantidad()) {
            throw new RuntimeException("Stock insuficiente para la variante: " + variante.getIdVariante());
        }

        Optional<CarritoProducto> itemExistente = carritoProductoRepository
                .findByCarritoAndVariante_IdVarianteAndEstado(
                        carrito,
                        variante.getIdVariante(),
                        EstadoItem.ACTIVO
                );

        CarritoProducto item;

        if (itemExistente.isPresent()) {
            item = itemExistente.get();
            item.setCantidad(item.getCantidad() + request.getCantidad());
        } else {
            item = new CarritoProducto();
            item.setCarrito(carrito);
            item.setVariante(variante);
            item.setCantidad(request.getCantidad());
            item.setPrecioUnitario(
                    variante.getProductoColor().getProducto().getPrecio()
            );
            item.setEstado(EstadoItem.ACTIVO);
        }

        carritoProductoRepository.save(item);

        return toResponse(item);
    }

    public List<CarritoItemResponse> obtenerCarrito(Integer idUsuario) {
        Carrito carrito = obtenerOCrearCarrito(idUsuario);

        return carritoProductoRepository
                .findByCarritoAndEstado(carrito, EstadoItem.ACTIVO)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void eliminarItem(Integer idItem) {
        CarritoProducto item = carritoProductoRepository.findById(idItem)
                .orElseThrow(() -> new RuntimeException("Ítem no encontrado: " + idItem));

        item.setEstado(EstadoItem.PROCESADO);
        carritoProductoRepository.save(item);
    }

    @Transactional
    public void finalizarCompra(Integer idUsuario) {
        Carrito carrito = obtenerOCrearCarrito(idUsuario);

        int itemsArchivados = carritoProductoRepository.archivarItemsDeCarrito(
                carrito,
                EstadoItem.ACTIVO,
                EstadoItem.PROCESADO
        );

        if (itemsArchivados == 0) {
            throw new RuntimeException("El carrito está vacío. No hay ítems que procesar.");
        }
    }

    @Transactional
    public void sincronizarCarrito(Integer idUsuario, List<AgregarItemRequest> items) {
        for (AgregarItemRequest itemRequest : items) {
            this.agregarItem(idUsuario, itemRequest);
        }
    }
}