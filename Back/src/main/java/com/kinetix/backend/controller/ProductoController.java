package com.kinetix.backend.controller;
//Ayuda
import com.kinetix.backend.dto.CatalogoDTO;
import com.kinetix.backend.dto.CatalogoProductoDTO;
import com.kinetix.backend.model.Producto;
import com.kinetix.backend.service.ProductoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public List<Producto> listarProductos() {
        return productoService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public Producto obtener(@PathVariable Integer id) {
        return productoService.obtenerPorId(id);
    }

    @GetMapping("/categoria/{idCategoria}")
    public List<Producto> obtenerPorCategoria(
            @PathVariable Integer idCategoria) {

        return productoService
                .obtenerPorCategoria(idCategoria);
    }

    @GetMapping("/detalle/{id}")
    public CatalogoProductoDTO obtenerDetalle(
            @PathVariable Integer id) {

        return productoService
                .obtenerDetalleProducto(id);
    }

    @GetMapping("/catalogo")
    public CatalogoDTO obtenerCatalogo() {

        return productoService.obtenerCatalogo();
    }

    /*
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
     */
}
