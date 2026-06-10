package com.kinetix.backend.repository;

import com.kinetix.backend.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository
        extends JpaRepository<Producto, Integer> {

    List<Producto> findByCategoria_IdCategoria(Integer idCategoria);

}