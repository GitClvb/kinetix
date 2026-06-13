package com.kinetix.fit.repository;

import com.kinetix.fit.model.VarianteImagen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VarianteImagenRepository
        extends JpaRepository<VarianteImagen, Integer> {

    List<VarianteImagen>
    findByProductoColor_IdProductoColor(
            Integer idProductoColor);

    Optional<VarianteImagen>
    findFirstByProductoColorProductoIdProductoOrderByIdImagenAsc(
            Integer idProducto
    );

    void deleteByProductoColor_IdProductoColor(
            Integer idProductoColor
    );

}