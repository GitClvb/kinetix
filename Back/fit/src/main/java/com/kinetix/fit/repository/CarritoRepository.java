package com.kinetix.fit.repository;

import com.kinetix.fit.model.Carrito;
import com.kinetix.fit.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Integer> {

    Optional<Carrito> findByUsuario(Usuario usuario);
}