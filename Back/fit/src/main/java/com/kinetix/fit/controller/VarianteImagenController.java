package com.kinetix.fit.controller;

import com.kinetix.fit.model.VarianteImagen;
import com.kinetix.fit.service.VarianteImagenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/imagenes")
public class VarianteImagenController {

    private final VarianteImagenService service;

    @Autowired
    public VarianteImagenController(VarianteImagenService service) {
        this.service = service;
    }

    @GetMapping("/producto-color/{idProductoColor}")
    public List<VarianteImagen> obtenerPorProductoColor(
            @PathVariable Integer idProductoColor) {

        return service.obtenerPorProductoColor(
                idProductoColor);
    }
}
