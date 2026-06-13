package com.kinetix.fit.repository;

import com.kinetix.fit.model.Carrito;
import com.kinetix.fit.model.CarritoProducto;
import com.kinetix.fit.model.CarritoProducto.EstadoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarritoProductoRepository extends JpaRepository<CarritoProducto, Integer> {

    // Ítems activos del carrito (los que "ve" el usuario)
    List<CarritoProducto> findByCarritoAndEstado(Carrito carrito, EstadoItem estado);

    // Buscar ítem específico activo (para acumular cantidad)
    Optional<CarritoProducto> findByCarritoAndVariante_IdVarianteAndEstado(
            Carrito carrito, Integer idVariante, EstadoItem estado);

    // Borrado lógico
    @Modifying
    @Query("UPDATE CarritoProducto cp SET cp.estado = :nuevoEstado " +
            "WHERE cp.carrito = :carrito AND cp.estado = :estadoActual")
    int archivarItemsDeCarrito(
            @Param("carrito") Carrito carrito,
            @Param("estadoActual") EstadoItem estadoActual,
            @Param("nuevoEstado") EstadoItem nuevoEstado);
}