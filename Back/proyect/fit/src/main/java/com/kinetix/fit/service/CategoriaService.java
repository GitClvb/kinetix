package com.kinetix.fit.service;

import com.kinetix.fit.model.Categoria;
import com.kinetix.fit.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {
    private final CategoriaRepository categoriaRepository;

    @Autowired
    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public List<Categoria> getCategorias(){
        return categoriaRepository.findAll();
    }

    public Categoria getCategoriaById(Integer id){
        return categoriaRepository.findById(id).orElse(null);
    }
}
