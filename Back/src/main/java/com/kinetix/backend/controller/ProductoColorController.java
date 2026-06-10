package com.kinetix.backend.controller;

import com.kinetix.backend.model.ProductoColor;
import com.kinetix.backend.service.ProductoColorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/producto-colores")
public class ProductoColorController {

    private final ProductoColorService service;

    @Autowired
    public ProductoColorController(ProductoColorService service) {
        this.service = service;
    }

    @GetMapping("/producto/{idProducto}")
    public List<ProductoColor> obtenerPorProducto(
            @PathVariable Integer idProducto) {

        return service.obtenerPorProducto(idProducto);
    }
}
