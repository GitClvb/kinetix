package com.kinetix.fit.repository;

import com.kinetix.fit.model.Talla;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TallaRepository extends JpaRepository<Talla, Integer> {

    //boolean existsByNombre(String nombre);
}
