package com.kinetix.fit.service;

import com.kinetix.fit.exception.ResourceNotFoundException;
import com.kinetix.fit.model.Talla;
import com.kinetix.fit.repository.TallaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TallaService {

    private final TallaRepository tallaRepository;

    public TallaService(TallaRepository tallaRepository) {
        this.tallaRepository = tallaRepository;
    }

    public List<Talla> listarTodas() {
        return tallaRepository.findAll();
    }

    public Talla buscarPorId(Integer idTalla) {
        return tallaRepository.findById(idTalla)
                .orElseThrow(() -> new ResourceNotFoundException("Talla encontrada"));
    }
}