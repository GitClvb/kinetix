package com.kinetix.fit.model;


import com.kinetix.fit.enums.PrincipalImagen;
import jakarta.persistence.*;

@Entity
@Table(name = "variante_imagenes")
public class VarianteImagen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_imagen")
    private Integer idImagen;

    @ManyToOne
    @JoinColumn(name = "id_producto_color", nullable = false)
    private ProductoColor productoColor;

    @Column(name = "url_imagen", nullable = false, length = 500)
    private String urlImagen;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PrincipalImagen principal;

    public VarianteImagen(Integer idImagen, PrincipalImagen principal, ProductoColor productoColor, String urlImagen) {
        this.idImagen = idImagen;
        this.principal = principal;
        this.productoColor = productoColor;
        this.urlImagen = urlImagen;
    }

    public VarianteImagen(){}

    public Integer getIdImagen() {
        return idImagen;
    }

    public void setIdImagen(Integer idImagen) {
        this.idImagen = idImagen;
    }

    public PrincipalImagen getPrincipal() {
        return principal;
    }

    public void setPrincipal(PrincipalImagen principal) {
        this.principal = principal;
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

    @Override
    public String toString() {
        return "VarianteImagen{" +
                "idImagen=" + idImagen +
                ", productoColor=" + productoColor +
                ", urlImagen='" + urlImagen + '\'' +
                ", principal=" + principal +
                '}';
    }
}