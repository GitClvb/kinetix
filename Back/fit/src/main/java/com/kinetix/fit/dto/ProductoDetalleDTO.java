package com.kinetix.fit.dto;

import com.kinetix.fit.enums.GeneroProducto;

import java.math.BigDecimal;
import java.util.List;

public class ProductoDetalleDTO {

    private Integer idProducto;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer idCategoria;
    private GeneroProducto genero;
    private List<ColorDetalleDTO> colores;

    public ProductoDetalleDTO(){}

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

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public Integer getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(Integer idCategoria) {
        this.idCategoria = idCategoria;
    }

    public GeneroProducto getGenero() {
        return genero;
    }

    public void setGenero(GeneroProducto genero) {
        this.genero = genero;
    }

    public List<ColorDetalleDTO> getColores() {
        return colores;
    }

    public void setColores(List<ColorDetalleDTO> colores) {
        this.colores = colores;
    }
}
