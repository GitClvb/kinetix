package com.kinetix.fit.repository;

import com.kinetix.fit.model.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Integer> {

    Optional<Pago> findByPedidoIdPedido(Integer idPedido);


}