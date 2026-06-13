package com.kinetix.fit.repository;

import com.kinetix.fit.model.Talla;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TallaRepository extends JpaRepository<Talla, Integer> {

    Optional<Talla> findByNombre(String nombre);
}
