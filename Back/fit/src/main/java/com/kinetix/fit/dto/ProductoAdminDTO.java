package com.kinetix.fit.dto;

import com.kinetix.fit.enums.GeneroProducto;

import java.math.BigDecimal;

public class ProductoAdminDTO {

    private Integer idProducto;
    private String nombre;
    private String categoria;
    private GeneroProducto genero;
    private BigDecimal precio;
    private String estado;
    private Integer totalColores;
    private String imagenPrincipal;

    public ProductoAdminDTO(){}

    public Integer getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Integer idProducto) {
        this.idProducto = idProducto;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public GeneroProducto getGenero() {
        return genero;
    }

    public void setGenero(GeneroProducto genero) {
        this.genero = genero;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Integer getTotalColores() {
        return totalColores;
    }

    public void setTotalColores(Integer totalColores) {
        this.totalColores = totalColores;
    }

    public String getImagenPrincipal() {
        return imagenPrincipal;
    }

    public void setImagenPrincipal(String imagenPrincipal) {
        this.imagenPrincipal = imagenPrincipal;
    }
}