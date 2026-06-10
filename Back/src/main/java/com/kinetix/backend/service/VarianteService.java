package com.kinetix.backend.service;

import com.kinetix.backend.model.Variante;
import com.kinetix.backend.repository.VarianteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VarianteService {

    private final VarianteRepository varianteRepository;

    @Autowired
    public VarianteService(VarianteRepository varianteRepository) {
        this.varianteRepository = varianteRepository;
    }

    public List<Variante> obtenerVariantesProducto(Integer idProducto) {
        return varianteRepository
                .findByProductoColor_Producto_IdProducto(idProducto);
    }

    public List<Variante> obtenerPorProducto(Integer idProducto) {
        return varianteRepository
                .findByProductoColor_Producto_IdProducto(idProducto);
    }
}
