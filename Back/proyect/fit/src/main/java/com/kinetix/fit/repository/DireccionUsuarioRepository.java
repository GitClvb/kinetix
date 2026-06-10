package com.kinetix.fit.repository;


import com.kinetix.fit.model.DireccionUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DireccionUsuarioRepository extends JpaRepository<DireccionUsuario, Integer> {

   List<DireccionUsuario> findByUsuarioIdUsuario(Integer idUsuario);

}