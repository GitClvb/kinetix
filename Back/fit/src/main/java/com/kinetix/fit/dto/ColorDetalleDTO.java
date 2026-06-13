package com.kinetix.fit.dto;

import java.util.List;

public class ColorDetalleDTO {

    private Integer idColor;
    private String imagen;
    private List<TallaDetalleDTO> tallas;

    public ColorDetalleDTO(){}

    public Integer getIdColor() {
        return idColor;
    }

    public void setIdColor(Integer idColor) {
        this.idColor = idColor;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public List<TallaDetalleDTO> getTallas() {
        return tallas;
    }

    public void setTallas(List<TallaDetalleDTO> tallas) {
        this.tallas = tallas;
    }
}
