package com.kinetix.fit.dto;

public class VarianteDTO {

    private Integer idVariante;
    private String  nombreTalla;

    public VarianteDTO() {}

    public VarianteDTO(Integer idVariante, String nombreTalla) {
        this.idVariante  = idVariante;
        this.nombreTalla = nombreTalla;
    }

    public Integer getIdVariante()  { return idVariante; }
    public void setIdVariante(Integer idVariante) { this.idVariante = idVariante; }

    public String getNombreTalla()  { return nombreTalla; }
    public void setNombreTalla(String nombreTalla) { this.nombreTalla = nombreTalla; }
}