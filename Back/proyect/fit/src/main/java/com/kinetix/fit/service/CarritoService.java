package com.kinetix.fit.service;

import com.kinetix.fit.exception.ResourceNotFoundException;
import com.kinetix.fit.model.Carrito;
import com.kinetix.fit.model.CarritoProducto;
import com.kinetix.fit.model.Usuario;
import com.kinetix.fit.model.Variante;
import com.kinetix.fit.repository.CarritoProductoRepository;
import com.kinetix.fit.repository.CarritoRepository;
import com.kinetix.fit.repository.UsuarioRepository;
import com.kinetix.fit.repository.VarianteRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final CarritoProductoRepository carritoProductoRepository;
    private final UsuarioRepository usuarioRepository;
    private final VarianteRepository varianteRepository;

    public CarritoService(
            CarritoRepository carritoRepository,
            CarritoProductoRepository carritoProductoRepository,
            UsuarioRepository usuarioRepository,
            VarianteRepository varianteRepository
    ) {
        this.carritoRepository = carritoRepository;
        this.carritoProductoRepository = carritoProductoRepository;
        this.usuarioRepository = usuarioRepository;
        this.varianteRepository = varianteRepository;
    }

    // Obtiene el carrito del usuario. Si no existe se crea automáticamente.
    public Carrito obtenerCarrito(Integer idUsuario) {
        Optional<Carrito> carritoExistente = carritoRepository.findByUsuarioIdUsuario(idUsuario);

        if (carritoExistente.isPresent()) {
            return carritoExistente.get();
        }

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Carrito carrito = new Carrito();
        carrito.setUsuario(usuario);
        carrito.setFechaCreacion(LocalDateTime.now());

        return carritoRepository.save(carrito);
    }

    // Agregar producto al carrito.
    public CarritoProducto agregarProducto(Integer idUsuario, Integer idVariante, Integer cantidad) {
        Carrito carrito = obtenerCarrito(idUsuario);

        Variante variante = varianteRepository.findById(idVariante)
                .orElseThrow(() -> new ResourceNotFoundException("Variante no encontrada"));

        Optional<CarritoProducto> itemExistente = carritoProductoRepository
                .findByCarritoIdCarritoAndVarianteIdVariante(
                        carrito.getIdCarrito(),
                        idVariante
                );

        if (itemExistente.isPresent()) {
            CarritoProducto item = itemExistente.get();
            item.setCantidad(item.getCantidad() + cantidad);
            return carritoProductoRepository.save(item);
        }

        BigDecimal precio = variante.getProductoColor()
                .getProducto()
                .getPrecio();

        CarritoProducto nuevoItem = new CarritoProducto();
        nuevoItem.setCarrito(carrito);
        nuevoItem.setVariante(variante);
        nuevoItem.setCantidad(cantidad);
        nuevoItem.setPrecioUnitario(precio);

        return carritoProductoRepository.save(nuevoItem);
    }

    // Obtener productos del carrito.
    public List<CarritoProducto> obtenerItems(Integer idUsuario) {
        Carrito carrito = obtenerCarrito(idUsuario);
        return carritoProductoRepository.findByCarritoIdCarrito(carrito.getIdCarrito());
    }

    // Actualizar cantidad.
    public CarritoProducto actualizarCantidad(Integer idItem, Integer cantidad) {
        CarritoProducto item = carritoProductoRepository.findById(idItem)
                .orElseThrow(() -> new ResourceNotFoundException("Item no encontrado"));

        item.setCantidad(cantidad);
        return carritoProductoRepository.save(item);
    }

    // Eliminar item
    public void eliminarItem(Integer idItem) {
        if (!carritoProductoRepository.existsById(idItem)) {
            throw new ResourceNotFoundException("Item no encontrado");
        }
        carritoProductoRepository.deleteById(idItem);
    }

    // Vaciar carrito.
    public void vaciarCarrito(Integer idUsuario) {
        Carrito carrito = obtenerCarrito(idUsuario);
        carritoProductoRepository.deleteByCarritoIdCarrito(carrito.getIdCarrito());
    }
}