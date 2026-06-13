package com.kinetix.fit.service;

import com.kinetix.fit.dto.ColorDTO;
import com.kinetix.fit.dto.CrearColorCatalogoDTO;
import com.kinetix.fit.model.Color;
import com.kinetix.fit.repository.ColorRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ColorService {

    private final ColorRepository colorRepository;

    @Autowired
    public ColorService(ColorRepository colorRepository) {
        this.colorRepository = colorRepository;
    }

    public List<ColorDTO> obtenerColores() {

        return colorRepository.findAll()
                .stream()
                .map(color -> {

                    ColorDTO dto =
                            new ColorDTO();

                    dto.setId(
                            color.getIdColor()
                    );

                    dto.setNombre(
                            color.getNombre()
                    );

                    dto.setCodigo(
                            color.getCodigoHex()
                    );

                    return dto;

                })
                .toList();

    }

    @Transactional
    public ColorDTO crearColor(
            CrearColorCatalogoDTO dto
    ) {
        if (colorRepository.existsByNombre(dto.getNombre())) {
            throw new RuntimeException(
                    "Ya existe un color con ese nombre"
            );
        }

        Color color =
                new Color();

        color.setNombre(
                dto.getNombre()
        );

        color.setCodigoHex(
                dto.getCodigo()
        );

        colorRepository.save(
                color
        );

        ColorDTO response =
                new ColorDTO();

        response.setId(
                color.getIdColor()
        );

        response.setNombre(
                color.getNombre()
        );

        response.setCodigo(
                color.getCodigoHex()
        );

        return response;

    }
}
