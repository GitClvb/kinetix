package com.kinetix.fit.dto;

import com.kinetix.fit.enums.MetodoPago;

public class PedidoRequest {

    private String nombreDestinatario;
    private String calle;
    private String numeroExterior;
    private String colonia;
    private String ciudad;
    private String estado;
    private String codigoPostal;
    private String pais;
    private MetodoPago metodoPago;

    public PedidoRequest() {}

    public String getNombreDestinatario()                          { return nombreDestinatario; }
    public void setNombreDestinatario(String nombreDestinatario)   { this.nombreDestinatario = nombreDestinatario; }

    public String getCalle()               { return calle; }
    public void setCalle(String calle)     { this.calle = calle; }

    public String getNumeroExterior()                      { return numeroExterior; }
    public void setNumeroExterior(String numeroExterior)   { this.numeroExterior = numeroExterior; }

    public String getColonia()                 { return colonia; }
    public void setColonia(String colonia)     { this.colonia = colonia; }

    public String getCiudad()                  { return ciudad; }
    public void setCiudad(String ciudad)       { this.ciudad = ciudad; }

    public String getEstado()                  { return estado; }
    public void setEstado(String estado)       { this.estado = estado; }

    public String getCodigoPostal()                        { return codigoPostal; }
    public void setCodigoPostal(String codigoPostal)       { this.codigoPostal = codigoPostal; }

    public String getPais()                { return pais != null ? pais : "México"; }
    public void setPais(String pais)       { this.pais = pais; }

    public MetodoPago getMetodoPago()                      { return metodoPago; }
    public void setMetodoPago(MetodoPago metodoPago)       { this.metodoPago = metodoPago; }
}