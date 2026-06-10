package com.kinetix.backend.repository;

import com.kinetix.backend.model.ProductoColor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoColorRepository
        extends JpaRepository<ProductoColor, Integer> {

    List<ProductoColor> findByProducto_IdProducto(
            Integer idProducto);

}