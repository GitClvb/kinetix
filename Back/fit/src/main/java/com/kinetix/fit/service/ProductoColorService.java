package com.kinetix.fit.service;

import com.kinetix.fit.model.ProductoColor;
import com.kinetix.fit.repository.ProductoColorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoColorService {

    private final ProductoColorRepository productoColorRepository;

    @Autowired
    public ProductoColorService(ProductoColorRepository productoColorRepository) {
        this.productoColorRepository = productoColorRepository;
    }

    public List<ProductoColor> obtenerPorProducto(
            Integer idProducto) {

        return productoColorRepository.findByProducto_IdProducto(
                idProducto);
    }
}
