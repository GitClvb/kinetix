package com.kinetix.backend.controller;

import com.kinetix.backend.model.Producto;
import com.kinetix.backend.repository.ProductoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoRepository productoRepository;

    public ProductoController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProductoPorId(@PathVariable Long id) {
        Optional<Producto> producto = productoRepository.findById(id);
        return producto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        Producto nuevoProducto = productoRepository.save(producto);
        return ResponseEntity.ok(nuevoProducto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id, @RequestBody Producto datosProducto) {
        return productoRepository.findById(id)
                .map(productoExistente -> {
                    productoExistente.setNombre(datosProducto.getNombre());
                    productoExistente.setDescripcion(datosProducto.getDescripcion());
                    productoExistente.setPrecio(datosProducto.getPrecio());
                    productoExistente.setStock(datosProducto.getStock());
                    Producto productoActualizado = productoRepository.save(productoExistente);
                    return ResponseEntity.ok(productoActualizado);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        return productoRepository.findById(id)
                .map(producto -> {
                    productoRepository.delete(producto);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
