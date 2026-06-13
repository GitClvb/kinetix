package com.kinetix.fit.controller;
import com.kinetix.fit.dto.*;
import com.kinetix.fit.model.Producto;
import com.kinetix.fit.service.ProductoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/{id}/estado")
    public ResponseEntity<ProductoDetalleDTO> obtenerProductoPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(productoService.obtenerProductoPorId(id)
        );
    }

    @GetMapping("/categoria/{idCategoria}")
    public List<Producto> obtenerPorCategoria(@PathVariable Integer idCategoria) {
        return productoService.obtenerPorCategoria(idCategoria);
    }

    @GetMapping("/detalle/{id}")
    public CatalogoProductoDTO obtenerDetalle(@PathVariable Integer id) {
        return productoService.obtenerDetalleProducto(id);
    }

    @GetMapping("/catalogo")
    public CatalogoDTO obtenerCatalogo() {
        return productoService.obtenerCatalogo();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void crearProducto(@RequestBody ProductoDetalleDTO dto) {
        productoService.crearProducto(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> actualizarProducto(@PathVariable Integer id, @RequestBody ProductoDetalleDTO dto) {
        productoService.actualizarProducto(id, dto);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Void> cambiarEstado(@PathVariable Integer id) {
        productoService.cambiarEstado(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admin")
    public ResponseEntity<List<ProductoAdminDTO>>
    obtenerProductosAdmin() {
        return ResponseEntity.ok(
                productoService.obtenerProductosAdmin()
        );
    }

}