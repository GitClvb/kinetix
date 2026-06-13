package com.kinetix.fit.dto;

import java.util.List;

public class CatalogoDTO {

    private List<CatalogoProductoDTO> hombre;
    private List<CatalogoProductoDTO> mujer;

    public CatalogoDTO(List<CatalogoProductoDTO> hombre, List<CatalogoProductoDTO> mujer) {
        this.hombre = hombre;
        this.mujer = mujer;
    }

    public CatalogoDTO() {
    }

    public List<CatalogoProductoDTO> getHombre() {
        return hombre;
    }

    public void setHombre(List<CatalogoProductoDTO> hombre) {
        this.hombre = hombre;
    }

    public List<CatalogoProductoDTO> getMujer() {
        return mujer;
    }

    public void setMujer(List<CatalogoProductoDTO> mujer) {
        this.mujer = mujer;
    }
}
