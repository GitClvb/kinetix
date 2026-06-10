package com.kinetix.fit.repository;


import com.kinetix.fit.model.CarritoProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarritoProductoRepository extends JpaRepository<CarritoProducto, Integer> {

    //Obtener items del carrito.
    List<CarritoProducto> findByCarritoIdCarrito(Integer idCarrito);

    //Verificar si la variante ya existe en el carrito.
    Optional<CarritoProducto> findByCarritoIdCarritoAndVarianteIdVariante(Integer idCarrito, Integer idVariante);

    //Vaciar carrito.
    void deleteByCarritoIdCarrito(Integer idCarrito);
}

