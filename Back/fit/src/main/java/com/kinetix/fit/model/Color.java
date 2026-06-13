package com.kinetix.fit.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "colores")
public class Color {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_color")
    private Integer idColor;

    @Column(nullable = false, unique = true, length = 50)
    private String nombre;

    @Column(name = "codigo_hex", length = 7)
    private String codigoHex;

    @OneToMany(mappedBy = "color")
    private List<ProductoColor> productoColores;

    public Color(String codigoHex, Integer idColor, String nombre) {
        this.codigoHex = codigoHex;
        this.idColor = idColor;
        this.nombre = nombre;
    }

    public Color(){}

    public String getCodigoHex() {
        return codigoHex;
    }

    public void setCodigoHex(String codigoHex) {
        this.codigoHex = codigoHex;
    }

    public Integer getIdColor() {
        return idColor;
    }

    public void setIdColor(Integer idColor) {
        this.idColor = idColor;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    @Override
    public String toString() {
        return "Color{" +
                "codigoHex='" + codigoHex + '\'' +
                ", idColor=" + idColor +
                ", nombre='" + nombre + '\'' +
                '}';
    }
}
