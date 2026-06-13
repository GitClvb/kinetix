package com.kinetix.fit.controller;

import com.kinetix.fit.dto.UsuarioAdminDTO;
import com.kinetix.fit.exception.ResourceNotFoundException;
import com.kinetix.fit.exception.ConflictException;
import com.kinetix.fit.model.Usuario;
import com.kinetix.fit.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    //Listar usuarios.
    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        return new ResponseEntity<>(
                usuarioService.listarTodos(),
                HttpStatus.OK
        );
    }

    //Buscar usuario por ID.
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Integer id) {
        try {
            Usuario usuario = usuarioService.buscarPorId(id);
            return new ResponseEntity<>(usuario, HttpStatus.OK);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //Registrar usuario.
    @PostMapping
    public ResponseEntity<Usuario> guardar(@RequestBody Usuario usuario) {
        try {
            Usuario nuevo = usuarioService.guardar(usuario);
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
        } catch (ConflictException ex) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    //Actualizar usuario.
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(@PathVariable Integer id, @RequestBody Usuario usuario) {
        try {
            Usuario actualizado = usuarioService.actualizar(id, usuario);
            return new ResponseEntity<>(actualizado, HttpStatus.OK);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //Baja lógica.
    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivar(@PathVariable Integer id) {
        try {
            usuarioService.desactivar(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //Reactivar usuario.
    @PatchMapping("/{id}/activar")
    public ResponseEntity<Void> activar(@PathVariable Integer id) {
        try {
            usuarioService.activar(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/admin/clientes")
    public ResponseEntity<List<UsuarioAdminDTO>> obtenerClientesAdmin() {

        return ResponseEntity.ok(
                usuarioService.obtenerClientesAdmin()
        );

    }

    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Long>>
    obtenerEstadisticas() {

        Map<String, Long> estadisticas =
                new HashMap<>();

        estadisticas.put(
                "usuariosTotales",
                usuarioService.contarUsuarios()
        );

        estadisticas.put(
                "clientes",
                usuarioService.contarClientes()
        );

        estadisticas.put(
                "admins",
                usuarioService.contarAdmins()
        );

        return ResponseEntity.ok(
                estadisticas
        );
    }



}