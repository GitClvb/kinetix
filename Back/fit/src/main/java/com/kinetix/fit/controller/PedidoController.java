package com.kinetix.fit.controller;

import com.kinetix.fit.dto.PedidoRequest;
import com.kinetix.fit.dto.PedidoResponse;
import com.kinetix.fit.service.PedidoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping("/{idUsuario}")
    public ResponseEntity<PedidoResponse> crearPedido(
            @PathVariable Integer idUsuario,
            @RequestBody PedidoRequest request) {

        PedidoResponse response = pedidoService.crearPedido(idUsuario, request);
        return ResponseEntity.ok(response);
    }
}