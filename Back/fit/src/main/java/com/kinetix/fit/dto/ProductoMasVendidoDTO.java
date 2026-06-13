package com.kinetix.fit.dto;

public class ProductoMasVendidoDTO {

    private Integer idProducto;
    private String nombre;
    private String descripcion;
    private Double precio;
    private Long totalVendidos;
    private String imagen;

    public ProductoMasVendidoDTO(Integer idProducto, String nombre, String descripcion, Double precio, Long totalVendidos, String imagen) {
        this.idProducto = idProducto;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.totalVendidos = totalVendidos;
        this.imagen = imagen;
    }

    public ProductoMasVendidoDTO() {
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Integer idProducto) {
        this.idProducto = idProducto;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Long getTotalVendidos() {
        return totalVendidos;
    }

    public void setTotalVendidos(Long totalVendidos) {
        this.totalVendidos = totalVendidos;
    }
}