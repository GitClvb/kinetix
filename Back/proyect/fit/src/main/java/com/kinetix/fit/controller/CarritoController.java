package com.kinetix.fit.controller;

import com.kinetix.fit.dto.CarritoRequest;
import com.kinetix.fit.dto.ActualizarCantidadRequest;
import com.kinetix.fit.exception.ResourceNotFoundException;
import com.kinetix.fit.model.CarritoProducto;
import com.kinetix.fit.service.CarritoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carrito")
public class CarritoController {

    private final CarritoService carritoService;

    public CarritoController(
            CarritoService carritoService
    ) {
        this.carritoService = carritoService;
    }

    /**
     * Agregar producto al carrito.
     */
    @PostMapping("/agregar")
    public ResponseEntity<CarritoProducto> agregarProducto(
            @RequestBody CarritoRequest request
    ) {

        try {

            CarritoProducto item =
                    carritoService.agregarProducto(
                            request.getIdUsuario(),
                            request.getIdVariante(),
                            request.getCantidad()
                    );

            return new ResponseEntity<>(
                    item,
                    HttpStatus.CREATED
            );

        } catch (ResourceNotFoundException ex) {

            return new ResponseEntity<>(
                    HttpStatus.NOT_FOUND
            );
        }
    }

    /**
     * Obtener carrito del usuario.
     */
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<CarritoProducto>> obtenerCarrito(
            @PathVariable Integer idUsuario
    ) {

        return new ResponseEntity<>(
                carritoService.obtenerItems(idUsuario),
                HttpStatus.OK
        );
    }

    /**
     * Actualizar cantidad de un producto.
     */
    @PatchMapping("/item/{idItem}")
    public ResponseEntity<CarritoProducto>
    actualizarCantidad(

            @PathVariable Integer idItem,

            @RequestBody
            ActualizarCantidadRequest request
    ) {

        try {

            CarritoProducto item =
                    carritoService.actualizarCantidad(
                            idItem,
                            request.getCantidad()
                    );

            return new ResponseEntity<>(
                    item,
                    HttpStatus.OK
            );

        } catch (ResourceNotFoundException ex) {

            return new ResponseEntity<>(
                    HttpStatus.NOT_FOUND
            );
        }
    }

    /**
     * Eliminar item del carrito.
     */
    @DeleteMapping("/item/{idItem}")
    public ResponseEntity<Void> eliminarItem(
            @PathVariable Integer idItem
    ) {

        try {

            carritoService.eliminarItem(idItem);

            return new ResponseEntity<>(
                    HttpStatus.NO_CONTENT
            );

        } catch (ResourceNotFoundException ex) {

            return new ResponseEntity<>(
                    HttpStatus.NOT_FOUND
            );
        }
    }

    /**
     * Vaciar carrito.
     */
    @DeleteMapping("/vaciar/{idUsuario}")
    public ResponseEntity<Void> vaciarCarrito(
            @PathVariable Integer idUsuario
    ) {

        carritoService.vaciarCarrito(idUsuario);

        return new ResponseEntity<>(
                HttpStatus.NO_CONTENT
        );
    }
}
