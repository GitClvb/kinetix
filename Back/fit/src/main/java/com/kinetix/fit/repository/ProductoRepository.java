package com.kinetix.fit.repository;


import com.kinetix.fit.enums.EstadoProducto;
import com.kinetix.fit.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository
        extends JpaRepository<Producto, Integer> {

    List<Producto> findByCategoria_IdCategoria(Integer idCategoria);

    List<Producto> findByEstado(EstadoProducto estado);

    Optional<Producto> findByIdProductoAndEstado(
            Integer idProducto,
            EstadoProducto estado
    );

}