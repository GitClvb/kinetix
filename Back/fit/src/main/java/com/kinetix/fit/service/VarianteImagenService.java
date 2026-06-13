package com.kinetix.fit.service;

import com.kinetix.fit.model.VarianteImagen;
import com.kinetix.fit.repository.VarianteImagenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VarianteImagenService {
    private final VarianteImagenRepository varianteImagenRepository;

    @Autowired
    public VarianteImagenService(VarianteImagenRepository varianteImagenRepository) {
        this.varianteImagenRepository = varianteImagenRepository;
    }

    public List<VarianteImagen>
    obtenerPorProductoColor(
            Integer idProductoColor) {

        return varianteImagenRepository
                .findByProductoColor_IdProductoColor(
                        idProductoColor);
    }
}
