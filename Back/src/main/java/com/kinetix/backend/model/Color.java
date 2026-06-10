package com.kinetix.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "colores")
public class Color {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_color")
    private Integer idColor;

    private String nombre;

    @Column(name = "codigo_hex")
    private String codigoHex;

    public Color(Integer idColor, String nombre, String codigoHex) {
        this.idColor = idColor;
        this.nombre = nombre;
        this.codigoHex = codigoHex;
    }

    public Color() { }

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

    public String getCodigoHex() {
        return codigoHex;
    }

    public void setCodigoHex(String codigoHex) {
        this.codigoHex = codigoHex;
    }
}
