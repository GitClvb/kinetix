package com.kinetix.backend.repository;

import com.kinetix.backend.model.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ColorRepository
        extends JpaRepository<Color, Integer> {
}