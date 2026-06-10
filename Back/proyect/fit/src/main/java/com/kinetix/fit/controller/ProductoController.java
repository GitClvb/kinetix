package com.kinetix.fit.controller;
import com.kinetix.fit.dto.CatalogoDTO;
import com.kinetix.fit.dto.CatalogoProductoDTO;
import com.kinetix.fit.model.Producto;
import com.kinetix.fit.service.ProductoService;
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

}
