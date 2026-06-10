package com.kinetix.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "producto_color")
public class ProductoColor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto_color")
    private Integer idProductoColor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_producto")
    private Producto producto;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_color")
    private Color color;

    public ProductoColor(Integer idProductoColor, Producto producto, Color color) {
        this.idProductoColor = idProductoColor;
        this.producto = producto;
        this.color = color;
    }

    public ProductoColor() { }

    public Integer getIdProductoColor() {
        return idProductoColor;
    }

    public void setIdProductoColor(Integer idProductoColor) {
        this.idProductoColor = idProductoColor;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }
}