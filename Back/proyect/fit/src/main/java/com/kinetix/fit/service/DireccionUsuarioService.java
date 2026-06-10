package com.kinetix.fit.service;

import com.kinetix.fit.exception.BadRequestException;
import com.kinetix.fit.exception.ResourceNotFoundException;
import com.kinetix.fit.model.DireccionUsuario;
import com.kinetix.fit.model.Usuario;
import com.kinetix.fit.repository.DireccionUsuarioRepository;
import com.kinetix.fit.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DireccionUsuarioService {

    @Autowired
    private DireccionUsuarioRepository direccionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<DireccionUsuario> listarPorUsuario(Integer idUsuario) {
        usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + idUsuario));
        return direccionRepository.findByUsuarioIdUsuario(idUsuario);
    }

    public DireccionUsuario buscarPorId(Integer id) {
        return direccionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dirección no encontrada con id: " + id));
    }

    public DireccionUsuario crear(Integer idUsuario, DireccionUsuario direccion) {
        validarCamposObligatorios(direccion);
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + idUsuario));
        direccion.setUsuario(usuario);
        return direccionRepository.save(direccion);
    }

    public DireccionUsuario actualizar(Integer idDireccion, DireccionUsuario datos) {
        DireccionUsuario direccion = buscarPorId(idDireccion);
        if (datos.getCalle() != null) direccion.setCalle(datos.getCalle());
        if (datos.getNumeroExterior() != null) direccion.setNumeroExterior(datos.getNumeroExterior());
        if (datos.getNumeroInterior() != null) direccion.setNumeroInterior(datos.getNumeroInterior());
        if (datos.getColonia() != null) direccion.setColonia(datos.getColonia());
        if (datos.getEstado() != null) direccion.setEstado(datos.getEstado());
        if (datos.getCodigoPostal() != null) direccion.setCodigoPostal(datos.getCodigoPostal());
        if (datos.getPais() != null) direccion.setPais(datos.getPais());
        if (datos.getNombreDestinatario() != null) direccion.setNombreDestinatario(datos.getNombreDestinatario());
        if (datos.getTelefonoContacto() != null) direccion.setTelefonoContacto(datos.getTelefonoContacto());
        if (datos.getReferencia() != null) direccion.setReferencia(datos.getReferencia());
        return direccionRepository.save(direccion);
    }

    public void eliminar(Integer idDireccion) {
        buscarPorId(idDireccion);
        direccionRepository.deleteById(idDireccion);
    }

    private void validarCamposObligatorios(DireccionUsuario d) {
        if (d.getCalle() == null || d.getCalle().isBlank()) throw new BadRequestException("La calle es obligatoria");
        if (d.getNumeroExterior() == null || d.getNumeroExterior().isBlank()) throw new BadRequestException("El número exterior es obligatorio");
        if (d.getColonia() == null || d.getColonia().isBlank()) throw new BadRequestException("La colonia es obligatoria");
        if (d.getEstado() == null || d.getEstado().isBlank()) throw new BadRequestException("El estado es obligatorio");
        if (d.getCodigoPostal() == null || d.getCodigoPostal().isBlank()) throw new BadRequestException("El código postal es obligatorio");
    }
}