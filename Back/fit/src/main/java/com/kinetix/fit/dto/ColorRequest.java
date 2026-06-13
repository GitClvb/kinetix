package com.kinetix.fit.dto;

import java.util.List;

public class ColorRequest {

    private Integer idColor;
    private List<ImagenRequest> imagenes;
    private List<TallaDetalleDTO> tallas;

    public ColorRequest() {
    }

    public Integer getIdColor() {
        return idColor;
    }

    public void setIdColor(Integer idColor) {
        this.idColor = idColor;
    }

    public List<ImagenRequest> getImagenes() {
        return imagenes;
    }

    public void setImagenes(List<ImagenRequest> imagenes) {
        this.imagenes = imagenes;
    }

    public List<TallaDetalleDTO> getTallas() {
        return tallas;
    }

    public void setTallas(List<TallaDetalleDTO> tallas) {
        this.tallas = tallas;
    }
}