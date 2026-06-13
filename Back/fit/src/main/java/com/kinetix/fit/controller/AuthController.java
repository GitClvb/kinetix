package com.kinetix.fit.controller;

import com.kinetix.fit.dto.LoginRequest;
import com.kinetix.fit.dto.LoginResponse;
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
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        try {

            Usuario usuario = usuarioService.login(
                    request.getCorreo(),
                    request.getContrasena()
            );

            LoginResponse response = new LoginResponse(
                    usuario.getIdUsuario(),
                    usuario.getNombre(),
                    usuario.getCorreo(),
                    usuario.getRol().name()
            );

            return ResponseEntity.ok(response);

        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}