package com.kinetix.fit.dto;

import java.util.List;

public class CatalogoColorDTO {

    private String codigo;
    private String imagen;
    private List<String> talla;

    public CatalogoColorDTO(String codigo, String imagen, List<String> talla) {
        this.codigo = codigo;
        this.imagen = imagen;
        this.talla = talla;
    }

    public CatalogoColorDTO(){  }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public List<String> getTalla() {
        return talla;
    }

    public void setTalla(List<String> talla) {
        this.talla = talla;
    }
}
