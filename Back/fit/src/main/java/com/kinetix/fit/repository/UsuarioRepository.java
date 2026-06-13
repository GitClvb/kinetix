package com.kinetix.fit.repository;

import com.kinetix.fit.enums.RolUsuario;
import com.kinetix.fit.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer>,
        JpaSpecificationExecutor<Usuario> {

    // Buscar usuario por correo
    Optional<Usuario> findByCorreo(String correo);

    // Login
    Optional<Usuario> findByCorreoAndContrasena(
            String correo,
            String contrasena
    );

    // Validar correo repetido
    boolean existsByCorreo(String correo);

    // Buscar usuarios por rol
    List<Usuario> findByRol(RolUsuario rol);

    // Contar usuarios por rol
    long countByRol(RolUsuario rol);
}