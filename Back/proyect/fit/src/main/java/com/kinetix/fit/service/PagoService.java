package com.kinetix.fit.service;


import com.kinetix.fit.enums.EstadoPago;
import com.kinetix.fit.exception.ResourceNotFoundException;
import com.kinetix.fit.model.Pago;
import com.kinetix.fit.model.Pedido;
import com.kinetix.fit.repository.PagoRepository;
import com.kinetix.fit.repository.PedidoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PagoService {

        private final PagoRepository pagoRepository;
        private final PedidoRepository pedidoRepository;

        public PagoService(
                PagoRepository pagoRepository,
                PedidoRepository pedidoRepository
        ) {
            this.pagoRepository = pagoRepository;
            this.pedidoRepository = pedidoRepository;
        }

        // Registrar pago.
        public Pago registrarPago(Integer idPedido, String referencia, com.kinetix.fit.enums.MetodoPago metodoPago) {

            Pedido pedido = pedidoRepository.findById(idPedido).orElseThrow(() ->
                                    new ResourceNotFoundException("Pedido no encontrado"));

            Pago pago = new Pago();

            pago.setPedido(pedido);
            pago.setMetodoPago(metodoPago);

            // Se registra inicialmente como pendiente
            pago.setEstadoPago(EstadoPago.pendiente);
            pago.setReferencia(referencia);
            pago.setFechaPago(LocalDateTime.now());

            return pagoRepository.save(pago);
        }

        //Buscar pago por id.
        public Pago buscarPorId(Integer idPago) {

            return pagoRepository.findById(idPago).orElseThrow(() ->
                    new ResourceNotFoundException("Pago no encontrado"));
        }

        //Obtener pagos de un pedido.
        public Optional<Pago> obtenerPorPedido(Integer idPedido) {
            return pagoRepository.findByPedidoIdPedido(idPedido);
        }

        //Listar todos los pagos.
        public List<Pago> listarTodos() {
            return pagoRepository.findAll();
        }

        // Actualizar estado.
        public Pago actualizarEstado(Integer idPago, EstadoPago estadoPago) {

            Pago pago = buscarPorId(idPago);
            pago.setEstadoPago(estadoPago);
            return pagoRepository.save(pago);
        }

}
