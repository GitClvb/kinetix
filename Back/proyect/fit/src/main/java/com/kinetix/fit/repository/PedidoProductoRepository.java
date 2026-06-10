package com.kinetix.fit.repository;

import com.kinetix.fit.model.PedidoProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoProductoRepository extends JpaRepository<PedidoProducto, Integer> {

    // para obtener detalle de un pedido.
    List<PedidoProducto> findByPedidoIdPedido(Integer idPedido);
}