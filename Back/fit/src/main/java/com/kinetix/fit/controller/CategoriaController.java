package com.kinetix.fit.controller;

import com.kinetix.fit.dto.CategoriaDTO;
import com.kinetix.fit.dto.CrearCategoriaDTO;
import com.kinetix.fit.model.Categoria;
import com.kinetix.fit.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    @Autowired
    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping
    public List<Categoria> listar() {
        return categoriaService.getCategorias();
    }

    @GetMapping("/{id}")
    public Categoria obtener(@PathVariable Integer id) {
        return categoriaService.getCategoriaById(id);
    }

    @GetMapping("/dto")
    public ResponseEntity<List<CategoriaDTO>>
    obtenerCategorias() {
        return ResponseEntity.ok(
                categoriaService.obtenerCategorias()
        );
    }

    @PostMapping
    public ResponseEntity<CategoriaDTO>
    crearCategoria(
            @RequestBody
            CrearCategoriaDTO dto
    ) {

        return ResponseEntity.ok(
                categoriaService.crearCategoria(
                        dto
                )
        );

    }
}
