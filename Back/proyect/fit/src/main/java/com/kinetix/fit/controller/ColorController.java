package com.kinetix.fit.controller;

import com.kinetix.fit.model.Color;
import com.kinetix.fit.repository.ColorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colores")
public class ColorController {

    private final ColorRepository colorRepository;

    public ColorController(ColorRepository colorRepository) {
        this.colorRepository = colorRepository;
    }

    @GetMapping
    public ResponseEntity<List<Color>> listar() {
        return new ResponseEntity<>(colorRepository.findAll(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Color> crear(@RequestBody Color color) {
        return new ResponseEntity<>(colorRepository.save(color), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Color> buscarPorId(@PathVariable Integer id) {
        return colorRepository.findById(id)
                .map(c -> new ResponseEntity<>(c, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}