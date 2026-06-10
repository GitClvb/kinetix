package com.kinetix.backend.repository;

import com.kinetix.backend.model.VarianteImagen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VarianteImagenRepository
        extends JpaRepository<VarianteImagen, Integer> {

    List<VarianteImagen>
    findByProductoColor_IdProductoColor(
            Integer idProductoColor);

}