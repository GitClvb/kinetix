package com.kinetix.fit.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "producto_color")
public class ProductoColor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto_color")
    private Integer idProductoColor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_color", nullable = false)
    private Color color;

    @OneToMany(mappedBy = "productoColor", fetch = FetchType.LAZY)
    private List<Variante> variantes;

    // @OneToMany(mappedBy = "productoColor")
    // private List<VarianteImagen> imagenes;

    // Constructores
    public ProductoColor() {
    }

    public ProductoColor(Color color, Producto producto) {
        this.color = color;
        this.producto = producto;
    }

    // Getters y Setters
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

    public List<Variante> getVariantes() {
        return variantes;
    }

    public void setVariantes(List<Variante> variantes) {
        this.variantes = variantes;
    }

    @Override
    public String toString() {
        return "ProductoColor{" +
                "idProductoColor=" + idProductoColor +
                ", color=" + color +
                '}';
    }
}