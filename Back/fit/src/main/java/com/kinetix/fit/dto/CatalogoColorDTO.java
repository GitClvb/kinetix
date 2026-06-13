package com.kinetix.fit.dto;

import java.util.List;

public class CatalogoColorDTO {

    private String codigo;
    private String imagen;

    @Deprecated
    private List<String> talla;

    private List<VarianteDTO> variantes;

    public CatalogoColorDTO() {}

    public CatalogoColorDTO(String codigo, String imagen, List<String> talla) {
        this.codigo = codigo;
        this.imagen = imagen;
        this.talla  = talla;
    }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }

    public List<String> getTalla() { return talla; }
    public void setTalla(List<String> talla) { this.talla = talla; }

    public List<VarianteDTO> getVariantes() { return variantes; }
    public void setVariantes(List<VarianteDTO> variantes) { this.variantes = variantes; }
}