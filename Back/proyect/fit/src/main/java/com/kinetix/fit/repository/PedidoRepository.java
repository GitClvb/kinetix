package com.kinetix.fit.repository;

import com.kinetix.fit.enums.EstadoPedido;
import com.kinetix.fit.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {

    //Historial de pedidos de un usuario.
    List<Pedido> findByUsuarioIdUsuario(Integer idUsuario);

    List<Pedido> findByEstado(EstadoPedido estado);
}