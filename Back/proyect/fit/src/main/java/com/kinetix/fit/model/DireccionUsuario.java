package com.kinetix.fit.model;

import jakarta.persistence.*;

@Entity
@Table(name = "direcciones_usuario")
public class DireccionUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_direccion")
    private Integer idDireccion;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "nombre_destinatario", length = 150)
    private String nombreDestinatario;

    @Column(name = "telefono_contacto", length = 20)
    private String telefonoContacto;

    @Column(nullable = false, length = 150)
    private String calle;

    @Column(name = "numero_exterior", nullable = false, length = 20)
    private String numeroExterior;

    @Column(name = "numero_interior", length = 20)
    private String numeroInterior;

    @Column(nullable = false, length = 100)
    private String colonia;

    @Column(nullable = false, length = 100)
    private String estado;

    @Column(name = "codigo_postal", nullable = false, length = 10)
    private String codigoPostal;

    @Column(nullable = false, length = 100)
    private String pais;

    @Column(columnDefinition = "TEXT")
    private String referencia;

    public DireccionUsuario(String calle, String codigoPostal, String colonia, String estado, Integer idDireccion, String nombreDestinatario, String numeroExterior, String numeroInterior, String pais, String referencia, String telefonoContacto, Usuario usuario) {
        this.calle = calle;
        this.codigoPostal = codigoPostal;
        this.colonia = colonia;
        this.estado = estado;
        this.idDireccion = idDireccion;
        this.nombreDestinatario = nombreDestinatario;
        this.numeroExterior = numeroExterior;
        this.numeroInterior = numeroInterior;
        this.pais = pais;
        this.referencia = referencia;
        this.telefonoContacto = telefonoContacto;
        this.usuario = usuario;
    }

    public DireccionUsuario(){}

    public String getCalle() {
        return calle;
    }

    public void setCalle(String calle) {
        this.calle = calle;
    }

    public String getCodigoPostal() {
        return codigoPostal;
    }

    public void setCodigoPostal(String codigoPostal) {
        this.codigoPostal = codigoPostal;
    }

    public String getColonia() {
        return colonia;
    }

    public void setColonia(String colonia) {
        this.colonia = colonia;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Integer getIdDireccion() {
        return idDireccion;
    }

    public void setIdDireccion(Integer idDireccion) {
        this.idDireccion = idDireccion;
    }

    public String getNombreDestinatario() {
        return nombreDestinatario;
    }

    public void setNombreDestinatario(String nombreDestinatario) {
        this.nombreDestinatario = nombreDestinatario;
    }

    public String getNumeroExterior() {
        return numeroExterior;
    }

    public void setNumeroExterior(String numeroExterior) {
        this.numeroExterior = numeroExterior;
    }

    public String getNumeroInterior() {
        return numeroInterior;
    }

    public void setNumeroInterior(String numeroInterior) {
        this.numeroInterior = numeroInterior;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public String getReferencia() {
        return referencia;
    }

    public void setReferencia(String referencia) {
        this.referencia = referencia;
    }

    public String getTelefonoContacto() {
        return telefonoContacto;
    }

    public void setTelefonoContacto(String telefonoContacto) {
        this.telefonoContacto = telefonoContacto;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    @Override
    public String toString() {
        return "DireccionUsuario{" +
                "calle='" + calle + '\'' +
                ", idDireccion=" + idDireccion +
                ", usuario=" + usuario +
                ", nombreDestinatario='" + nombreDestinatario + '\'' +
                ", telefonoContacto='" + telefonoContacto + '\'' +
                ", numeroExterior='" + numeroExterior + '\'' +
                ", numeroInterior='" + numeroInterior + '\'' +
                ", colonia='" + colonia + '\'' +
                ", estado='" + estado + '\'' +
                ", codigoPostal='" + codigoPostal + '\'' +
                ", pais='" + pais + '\'' +
                ", referencia='" + referencia + '\'' +
                '}';
    }
}