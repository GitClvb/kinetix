package com.kinetix.backend.controller;

import com.kinetix.backend.model.Variante;
import com.kinetix.backend.service.VarianteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/variantes")
public class VarianteController {

    private final VarianteService varianteService;

    @Autowired
    public VarianteController(VarianteService varianteService) {
        this.varianteService = varianteService;
    }

    @GetMapping("/producto/{idProducto}")
    public List<Variante> obtenerPorProducto(
            @PathVariable Integer idProducto) {

        return varianteService.obtenerPorProducto(idProducto);
    }
}

