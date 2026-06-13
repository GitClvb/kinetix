package com.kinetix.fit.dto;

import java.util.List;

public class CatalogoProductoDTO {

    private Integer idProducto;
    private String nombre;
    private String categoria;
    private String precio;
    private String descripcion;
    private List<CatalogoColorDTO> colores;

    public CatalogoProductoDTO(Integer idProducto, String nombre, String categoria, String precio, String descripcion, List<CatalogoColorDTO> colores) {
        this.idProducto = idProducto;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.descripcion = descripcion;
        this.colores = colores;
    }

    public CatalogoProductoDTO(){ }

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

    public String getPrecio() {
        return precio;
    }

    public void setPrecio(String precio) {
        this.precio = precio;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public List<CatalogoColorDTO> getColores() {
        return colores;
    }

    public void setColores(List<CatalogoColorDTO> colores) {
        this.colores = colores;
    }
}
