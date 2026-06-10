package com.kinetix.fit.controller;

import com.kinetix.fit.dto.ActualizarEstadoPedidoRequest;
import com.kinetix.fit.dto.PedidoRequest;
import com.kinetix.fit.exception.ResourceNotFoundException;
import com.kinetix.fit.model.Pedido;
import com.kinetix.fit.model.PedidoProducto;
import com.kinetix.fit.service.PedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    //Crear pedido

    @PostMapping
    public ResponseEntity<Pedido> crearPedido(@RequestBody PedidoRequest request) {
        try {

            Pedido pedido = pedidoService.crearPedido(request.getIdUsuario(), request.getIdDireccion());

            return new ResponseEntity<>(pedido, HttpStatus.CREATED);

        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Listar todos los pedidos
    @GetMapping
    public ResponseEntity<List<Pedido>> listarTodos() {

        return new ResponseEntity<>(
                pedidoService.listarTodos(),
                HttpStatus.OK
        );
    }

    //Buscar pedido por id
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> buscarPorId(
            @PathVariable Integer id
    ) {

        try {

            Pedido pedido =
                    pedidoService.buscarPorId(id);

            return new ResponseEntity<>(
                    pedido,
                    HttpStatus.OK
            );

        } catch (ResourceNotFoundException ex) {

            return new ResponseEntity<>(
                    HttpStatus.NOT_FOUND
            );
        }
    }

    //Historial de pedidos de un usuario.
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Pedido>> historialUsuario(
            @PathVariable Integer idUsuario
    ) {
        return new ResponseEntity<>(pedidoService.historialUsuario(idUsuario), HttpStatus.OK);
    }

    //Detalle de productos del pedido.

    @GetMapping("/{id}/detalle")
    public ResponseEntity<List<PedidoProducto>> detallePedido(
            @PathVariable Integer id
    ) {

        try {

            return new ResponseEntity<>(
                    pedidoService.obtenerDetalle(id),
                    HttpStatus.OK
            );

        } catch (ResourceNotFoundException ex) {

            return new ResponseEntity<>(
                    HttpStatus.NOT_FOUND
            );
        }
    }

    //Actualizar estado
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Pedido> actualizarEstado(

            @PathVariable Integer id,

            @RequestBody
            ActualizarEstadoPedidoRequest request
    ) {

        try {

            Pedido pedido = pedidoService.actualizarEstado(id, request.getEstado());

            return new ResponseEntity<>(pedido, HttpStatus.OK);

        } catch (ResourceNotFoundException ex) {

            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }




}
