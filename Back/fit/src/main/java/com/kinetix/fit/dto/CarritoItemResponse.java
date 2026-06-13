package com.kinetix.fit.dto;

import java.math.BigDecimal;

public class CarritoItemResponse {

    private Integer idItem;
    private Integer idVariante;
    private String nombreProducto;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
    private String imagen;
    private String talla;
    private String codigoColor;

    public CarritoItemResponse() {}

    public CarritoItemResponse(Integer idItem, Integer idVariante, String nombreProducto, Integer cantidad, BigDecimal precioUnitario, String imagen, String talla, String codigoColor) {
        this.idItem         = idItem;
        this.idVariante     = idVariante;
        this.nombreProducto = nombreProducto;
        this.cantidad       = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal       = precioUnitario.multiply(BigDecimal.valueOf(cantidad));
        this.imagen         = imagen;
        this.talla          = talla;
        this.codigoColor    = codigoColor;
    }


    public Integer getIdItem()               { return idItem; }
    public void setIdItem(Integer idItem)    { this.idItem = idItem; }

    public Integer getIdVariante()                  { return idVariante; }
    public void setIdVariante(Integer idVariante)   { this.idVariante = idVariante; }

    public String getNombreProducto()                      { return nombreProducto; }
    public void setNombreProducto(String nombreProducto)   { this.nombreProducto = nombreProducto; }

    public Integer getCantidad()                 { return cantidad; }
    public void setCantidad(Integer cantidad)    { this.cantidad = cantidad; }

    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }

    public BigDecimal getSubtotal()                      { return subtotal; }
    public void setSubtotal(BigDecimal subtotal)         { this.subtotal = subtotal; }

    public String getImagen()                { return imagen; }
    public void setImagen(String imagen)     { this.imagen = imagen; }

    public String getTalla()                 { return talla; }
    public void setTalla(String talla)       { this.talla = talla; }

    public String getCodigoColor()                   { return codigoColor; }
    public void setCodigoColor(String codigoColor)   { this.codigoColor = codigoColor; }
}