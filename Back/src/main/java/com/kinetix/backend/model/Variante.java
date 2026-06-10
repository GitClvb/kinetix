package com.kinetix.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "variantes")
public class Variante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_variante")
    private Integer idVariante;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_producto_color")
    private ProductoColor productoColor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_talla")
    private Talla talla;

    private Integer stock;

    public Variante(Integer idVariante, ProductoColor productoColor, Talla talla, Integer stock) {
        this.idVariante = idVariante;
        this.productoColor = productoColor;
        this.talla = talla;
        this.stock = stock;
    }

    public Variante() { }

    public Integer getIdVariante() {
        return idVariante;
    }

    public void setIdVariante(Integer idVariante) {
        this.idVariante = idVariante;
    }

    public ProductoColor getProductoColor() {
        return productoColor;
    }

    public void setProductoColor(ProductoColor productoColor) {
        this.productoColor = productoColor;
    }

    public Talla getTalla() {
        return talla;
    }

    public void setTalla(Talla talla) {
        this.talla = talla;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
}
