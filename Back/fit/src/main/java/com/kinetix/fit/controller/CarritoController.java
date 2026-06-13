package com.kinetix.fit.controller;

import com.kinetix.fit.dto.AgregarItemRequest;
import com.kinetix.fit.dto.CarritoItemResponse;
import com.kinetix.fit.service.CarritoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carrito")
public class CarritoController {

    private final CarritoService carritoService;

    public CarritoController(CarritoService carritoService) {
        this.carritoService = carritoService;
    }

    // GET  /api/carrito/{idUsuario}
    @GetMapping("/{idUsuario}")
    public ResponseEntity<List<CarritoItemResponse>> obtenerCarrito(@PathVariable Integer idUsuario) {
        return ResponseEntity.ok(carritoService.obtenerCarrito(idUsuario));
    }

    // POST /api/carrito/{idUsuario}/items
    @PostMapping("/{idUsuario}/items")
    public ResponseEntity<CarritoItemResponse> agregarItem(
            @PathVariable Integer idUsuario,
            @RequestBody AgregarItemRequest request) {
        return ResponseEntity.ok(carritoService.agregarItem(idUsuario, request));
    }

    // DELETE /api/carrito/items/{idItem}   ← borrado lógico individual
    @DeleteMapping("/items/{idItem}")
    public ResponseEntity<Void> eliminarItem(@PathVariable Integer idItem) {
        carritoService.eliminarItem(idItem);
        return ResponseEntity.noContent().build();
    }

    // POST /api/carrito/{idUsuario}/finalizar
    @PostMapping("/{idUsuario}/finalizar")
    public ResponseEntity<String> finalizarCompra(@PathVariable Integer idUsuario) {
        carritoService.finalizarCompra(idUsuario);
        return ResponseEntity.ok("Compra finalizada. Carrito archivado correctamente.");
    }

    // POST /api/carrito/{idUsuario}/sync
    @PostMapping("/{idUsuario}/sync")
    public ResponseEntity<String> sincronizarCarrito(
            @PathVariable Integer idUsuario,
            @RequestBody List<AgregarItemRequest> items) {

        // Aquí el servicio debe iterar sobre la lista y agregarlos al usuario
        carritoService.sincronizarCarrito(idUsuario, items);
        return ResponseEntity.ok("Carrito sincronizado");
    }
}