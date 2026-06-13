package com.kinetix.fit.service;

import com.kinetix.fit.dto.CategoriaDTO;
import com.kinetix.fit.dto.CrearCategoriaDTO;
import com.kinetix.fit.model.Categoria;
import com.kinetix.fit.repository.CategoriaRepository;
import jakarta.transaction.Transactional;
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

    public List<CategoriaDTO> obtenerCategorias() {

        return categoriaRepository.findAll().stream()
                .map(categoria -> {
                    CategoriaDTO dto = new CategoriaDTO();
                    dto.setId(categoria.getIdCategoria());
                    dto.setNombre(categoria.getNombre());
                    return dto;
                })
                .toList();
    }

    @Transactional
    public CategoriaDTO crearCategoria(CrearCategoriaDTO dto) {
        Categoria categoria = new Categoria();
        categoria.setNombre(dto.getNombre());
        categoriaRepository.save(categoria);
        CategoriaDTO response = new CategoriaDTO();
        response.setId(categoria.getIdCategoria());
        response.setNombre(categoria.getNombre());
        return response;

    }
}
