package com.kinetix.fit.controller;

import com.kinetix.fit.dto.RegistrarPagoRequest;
import com.kinetix.fit.dto.ActualizarEstadoPagoRequest;
import com.kinetix.fit.exception.ResourceNotFoundException;
import com.kinetix.fit.model.Pago;
import com.kinetix.fit.service.PagoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

        private final PagoService pagoService;

        public PagoController(
                PagoService pagoService
        ) {
            this.pagoService = pagoService;
        }

        //Registrar pago.

        @PostMapping
        public ResponseEntity<Pago> registrarPago(@RequestBody RegistrarPagoRequest request) {
            try {
                Pago pago = pagoService.registrarPago(
                                request.getIdPedido(),
                                request.getReferencia(),
                                request.getMetodoPago()
                        );
                return new ResponseEntity<>(pago, HttpStatus.CREATED);
            } catch (ResourceNotFoundException ex) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND
                );
            }
        }

        //Listar pagos.
        @GetMapping
        public ResponseEntity<List<Pago>> listarTodos() {
            return new ResponseEntity<>(pagoService.listarTodos(), HttpStatus.OK);
        }

        //Buscar pago por id
        @GetMapping("/{id}")
        public ResponseEntity<Pago> buscarPorId(@PathVariable Integer id) {
            try {
                return new ResponseEntity<>(pagoService.buscarPorId(id), HttpStatus.OK);
            } catch (ResourceNotFoundException ex) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }

        // Pagos asociados a un pedido.
        @GetMapping("/pedido/{idPedido}")
        public ResponseEntity<Optional<Pago>> obtenerPorPedido(@PathVariable Integer idPedido) {
            return new ResponseEntity<>(pagoService.obtenerPorPedido(idPedido), HttpStatus.OK);
        }

        //Actualizar estado del pago.
        @PatchMapping("/{id}/estado")
        public ResponseEntity<Pago> actualizarEstado(
                @PathVariable Integer id,
                @RequestBody
                ActualizarEstadoPagoRequest request
        ) {

            try {

                Pago pago = pagoService.actualizarEstado(id, request.getEstadoPago());

                return new ResponseEntity<>(pago, HttpStatus.OK);

            } catch (ResourceNotFoundException ex) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }

}
