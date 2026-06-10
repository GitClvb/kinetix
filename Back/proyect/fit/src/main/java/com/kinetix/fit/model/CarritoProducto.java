package com.kinetix.fit.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "carrito_productos")
public class CarritoProducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_item")
    private Integer idItem;

    @ManyToOne
    @JoinColumn(name = "id_carrito", nullable = false)
    private Carrito carrito;

    @ManyToOne
    @JoinColumn(name = "id_variante", nullable = false)
    private Variante variante;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    public CarritoProducto(Integer cantidad, Carrito carrito, Integer idItem, BigDecimal precioUnitario, Variante variante) {
        this.cantidad = cantidad;
        this.carrito = carrito;
        this.idItem = idItem;
        this.precioUnitario = precioUnitario;
        this.variante = variante;
    }

    public CarritoProducto() {
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Carrito getCarrito() {
        return carrito;
    }

    public void setCarrito(Carrito carrito) {
        this.carrito = carrito;
    }

    public Integer getIdItem() {
        return idItem;
    }

    public void setIdItem(Integer idItem) {
        this.idItem = idItem;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }
    public BigDecimal getPrecioUnitario() {
        return null;
    }

    public Variante getVariante() {
        return variante;
    }

    public void setVariante(Variante variante) {
        this.variante = variante;
    }

    @Override
    public String toString() {
        return "CarritoProducto{" +
                "cantidad=" + cantidad +
                ", idItem=" + idItem +
                ", carrito=" + carrito +
                ", variante=" + variante +
                ", precioUnitario=" + precioUnitario +
                '}';
    }


}