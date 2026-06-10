package com.kinetix.fit.controller;

import com.kinetix.fit.dto.LoginRequest;
import com.kinetix.fit.exception.ResourceNotFoundException;
import com.kinetix.fit.model.Usuario;
import com.kinetix.fit.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody LoginRequest request) {
        try {
            Usuario usuario = usuarioService.login(request.getCorreo(), request.getContrasena());
            return new ResponseEntity<>(usuario, HttpStatus.OK);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
