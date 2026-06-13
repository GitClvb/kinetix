package com.kinetix.fit.service;

import com.kinetix.fit.dto.UsuarioAdminDTO;
import com.kinetix.fit.enums.EstadoUsuario;
import com.kinetix.fit.enums.RolUsuario;
import com.kinetix.fit.exception.ConflictException;
import com.kinetix.fit.exception.ResourceNotFoundException;
import com.kinetix.fit.model.Usuario;
import com.kinetix.fit.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    //Registrar usuario
    public Usuario guardar(Usuario usuario) {

        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new ConflictException(
                    "El correo ya se encuentra registrado"
            );
        }

        usuario.setCorreo(usuario.getCorreo().toLowerCase());
        usuario.setRol(RolUsuario.cliente);
        usuario.setEstado(EstadoUsuario.activo);
        usuario.setFechaRegistro(LocalDateTime.now());
        return usuarioRepository.save(usuario);
    }

    //Obtener todos los usuarios
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    //Buscar usuario por ID
    public Usuario buscarPorId(Integer id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    //Actualizar usuario
    public Usuario actualizar(Integer id, Usuario usuarioActualizado) {

        Usuario usuario = buscarPorId(id);

        usuario.setNombre(usuarioActualizado.getNombre());
        usuario.setApellido(usuarioActualizado.getApellido());
        usuario.setTelefono(usuarioActualizado.getTelefono());

        return usuarioRepository.save(usuario);
    }

    //Baja lógica
    public void desactivar(Integer id) {
        Usuario usuario = buscarPorId(id);
        usuario.setEstado(EstadoUsuario.inactivo);
        usuarioRepository.save(usuario);
    }

    //Reactivar usuario
    public void activar(Integer id) {
        Usuario usuario = buscarPorId(id);
        usuario.setEstado(EstadoUsuario.activo);
        usuarioRepository.save(usuario);
    }

    //Login
    public Usuario login(String correo, String contrasena) {
        return usuarioRepository
                .findByCorreoAndContrasena(correo, contrasena)
                .orElseThrow(() -> new ResourceNotFoundException("Correo o contraseña incorrectos"));
    }

    public List<UsuarioAdminDTO> obtenerClientesAdmin() {

        List<Usuario> usuarios =
                usuarioRepository.findAll();

        List<UsuarioAdminDTO> resultado =
                new ArrayList<>();

        for (Usuario usuario : usuarios) {

            if (usuario.getRol() != RolUsuario.cliente) {
                continue;
            }

            UsuarioAdminDTO dto =
                    new UsuarioAdminDTO();

            dto.setIdUsuario(
                    usuario.getIdUsuario()
            );

            dto.setNombreCompleto(
                    usuario.getNombre()
                            + " "
                            + usuario.getApellido()
            );

            dto.setCorreo(
                    usuario.getCorreo()
            );

            dto.setTelefono(
                    usuario.getTelefono()
            );

            dto.setEstado(
                    usuario.getEstado()
            );

            dto.setFechaRegistro(
                    usuario.getFechaRegistro()
                            .toLocalDate()
                            .toString()
            );

            resultado.add(dto);

        }

        return resultado;
    }

    //para estadisticas

    public long contarUsuarios() {
        return usuarioRepository.count();
    }

    public long contarClientes() {
        return usuarioRepository.countByRol(RolUsuario.cliente);
    }

    public long contarAdmins() {
        return usuarioRepository.countByRol(RolUsuario.admin);
    }



}