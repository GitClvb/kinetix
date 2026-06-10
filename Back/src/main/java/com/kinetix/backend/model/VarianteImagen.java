package com.kinetix.backend.model;

import com.kinetix.backend.common.PrincipalImagen;
import jakarta.persistence.*;

@Entity
@Table(name = "variante_imagenes")
public class VarianteImagen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_imagen")
    private Integer idImagen;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_producto_color")
    private ProductoColor productoColor;

    @Column(name = "url_imagen")
    private String urlImagen;

    @Enumerated(EnumType.STRING)
    @Column(name = "principal")
    private PrincipalImagen principal;

    public VarianteImagen(Integer idImagen, ProductoColor productoColor, String urlImagen, PrincipalImagen principal) {
        this.idImagen = idImagen;
        this.productoColor = productoColor;
        this.urlImagen = urlImagen;
        this.principal = principal;
    }

    public VarianteImagen() { }

    public Integer getIdImagen() {
        return idImagen;
    }

    public void setIdImagen(Integer idImagen) {
        this.idImagen = idImagen;
    }

    public ProductoColor getProductoColor() {
        return productoColor;
    }

    public void setProductoColor(ProductoColor productoColor) {
        this.productoColor = productoColor;
    }

    public String getUrlImagen() {
        return urlImagen;
    }

    public void setUrlImagen(String urlImagen) {
        this.urlImagen = urlImagen;
    }

    public PrincipalImagen getPrincipal() {
        return principal;
    }

    public void setPrincipal(PrincipalImagen principal) {
        this.principal = principal;
    }
}
