package com.kinetix.fit.expecification;

import com.kinetix.fit.enums.EstadoProducto;
import com.kinetix.fit.enums.GeneroProducto;
import com.kinetix.fit.model.Producto;
import com.kinetix.fit.model.ProductoColor;
import com.kinetix.fit.model.Variante;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

public class ProductoSpecification {

    // =========================
    // FILTRO: NOMBRE
    // =========================
    public static Specification<Producto> nombreContains(String nombre) {
        return (root, query, cb) -> {
            if (nombre == null || nombre.isBlank()) {
                return cb.conjunction();
            }

            return cb.like(
                    cb.lower(root.get("nombre")),
                    "%" + nombre.toLowerCase() + "%"
            );
        };
    }

    // =========================
    // FILTRO: CATEGORÍA
    // =========================
    public static Specification<Producto> categoriaEquals(Integer idCategoria) {
        return (root, query, cb) -> {
            if (idCategoria == null) {
                return cb.conjunction();
            }

            return cb.equal(
                    root.get("categoria").get("idCategoria"),
                    idCategoria
            );
        };
    }

    // =========================
    // FILTRO: GÉNERO
    // =========================
    public static Specification<Producto> generoEquals(GeneroProducto genero) {
        return (root, query, cb) -> {
            if (genero == null) {
                return cb.conjunction();
            }

            return cb.equal(root.get("genero"), genero);
        };
    }

    // =========================
    // FILTRO: ESTADO
    // =========================
    public static Specification<Producto> estadoEquals(EstadoProducto estado) {
        return (root, query, cb) -> {
            if (estado == null) {
                return cb.conjunction();
            }

            return cb.equal(root.get("estado"), estado);
        };
    }

    // =========================
    // FILTRO: COLOR
    // Producto -> ProductoColor -> Color
    // =========================
    public static Specification<Producto> colorEquals(Integer idColor) {
        return (root, query, cb) -> {
            if (idColor == null) {
                return cb.conjunction();
            }

            query.distinct(true);

            Join<Producto, ProductoColor> productoColor =
                    root.join("productoColores");

            return cb.equal(
                    productoColor.get("color").get("idColor"),
                    idColor
            );
        };
    }

    // =========================
    // FILTRO: TALLA
    // Producto -> ProductoColor -> Variante -> Talla
    // =========================
    public static Specification<Producto> tallaEquals(Integer idTalla) {
        return (root, query, cb) -> {
            if (idTalla == null) {
                return cb.conjunction();
            }

            query.distinct(true);

            Join<Producto, ProductoColor> productoColor =
                    root.join("productoColores");

            Join<ProductoColor, Variante> variante =
                    productoColor.join("variantes");

            return cb.equal(
                    variante.get("talla").get("idTalla"),
                    idTalla
            );
        };
    }
}