package com.kinetix.fit.controller;

import com.kinetix.fit.dto.ProductoMasVendidoDTO;
import com.kinetix.fit.service.PedidoProductoService;
import com.kinetix.fit.service.ProductoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class PedidoProductoController {

    private final PedidoProductoService pedidoProductoService;

    public PedidoProductoController(PedidoProductoService pedidoProductoService) {
        this.pedidoProductoService = pedidoProductoService;
    }


    @GetMapping("/mas-vendidos")
    public ResponseEntity<List<ProductoMasVendidoDTO>> obtenerMasVendidos(
            @RequestParam(defaultValue = "4") int limit
    ) {
        return ResponseEntity.ok(pedidoProductoService.obtenerMasVendidos(limit));
    }
}