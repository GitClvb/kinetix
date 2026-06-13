package com.kinetix.fit.dto;

public class AgregarItemRequest {

    private Integer idVariante;
    private Integer cantidad;

    public AgregarItemRequest() {}

    public Integer getIdVariante() { return idVariante; }
    public void setIdVariante(Integer idVariante) { this.idVariante = idVariante; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}