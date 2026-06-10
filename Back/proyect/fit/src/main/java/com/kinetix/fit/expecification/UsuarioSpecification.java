package com.kinetix.fit.expecification;

import com.kinetix.fit.enums.EstadoUsuario;
import com.kinetix.fit.enums.RolUsuario;
import com.kinetix.fit.model.Usuario;
import org.springframework.data.jpa.domain.Specification;

public class UsuarioSpecification {

    public static Specification<Usuario> nombreContains(String nombre) {
        return (root, query, cb) -> {
            if (nombre == null || nombre.isBlank()) return null;

            return cb.like(
                    cb.lower(root.get("nombre")),
                    "%" + nombre.toLowerCase() + "%"
            );
        };
    }

    public static Specification<Usuario> rolEquals(RolUsuario rol) {
        return (root, query, cb) ->
                rol == null ? null : cb.equal(root.get("rol"), rol);
    }

    public static Specification<Usuario> estadoEquals(EstadoUsuario estado) {
        return (root, query, cb) ->
                estado == null ? null : cb.equal(root.get("estado"), estado);
    }
}