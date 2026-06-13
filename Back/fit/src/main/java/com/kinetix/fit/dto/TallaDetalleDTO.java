package com.kinetix.fit.dto;

public class TallaDetalleDTO {

    private Integer idTalla;
    private String talla;
    private Integer stock;

    public TallaDetalleDTO(Integer idTalla, Integer stock, String talla) {
        this.idTalla = idTalla;
        this.stock = stock;
        this.talla = talla;
    }

    public TallaDetalleDTO() {
    }

    public Integer getIdTalla() {
        return idTalla;
    }

    public void setIdTalla(Integer idTalla) {
        this.idTalla = idTalla;
    }

    public String getTalla() {
        return talla;
    }

    public void setTalla(String talla) {
        this.talla = talla;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
}