package com.kinetix.fit.repository;


import com.kinetix.fit.model.Variante;
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
