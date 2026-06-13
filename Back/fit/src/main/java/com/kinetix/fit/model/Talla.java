package com.kinetix.fit.model;

import jakarta.persistence.*;

import java.util.List;


@Entity
@Table(name = "tallas")
public class Talla {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_talla")
    private Integer idTalla;

    @Column(nullable = false, unique = true, length = 20)
    private String nombre;

    @OneToMany(mappedBy = "talla")
    private List<Variante> variantes;

    public Talla(Integer idTalla, String nombre) {
        this.idTalla = idTalla;
        this.nombre = nombre;
    }

    public Talla(){}

    public Integer getIdTalla() {
        return idTalla;
    }

    public void setIdTalla(Integer idTalla) {
        this.idTalla = idTalla;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    @Override
    public String toString() {
        return "Talla{" +
                "idTalla=" + idTalla +
                ", nombre='" + nombre + '\'' +
                '}';
    }
}