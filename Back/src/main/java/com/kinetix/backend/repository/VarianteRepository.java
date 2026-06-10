package com.kinetix.backend.repository;

import com.kinetix.backend.model.Variante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VarianteRepository
        extends JpaRepository<Variante, Integer> {

    List<Variante> findByProductoColor_Producto_IdProducto(
            Integer idProducto);

    List<Variante>
    findByProductoColor_IdProductoColor(
            Integer idProductoColor);

}
