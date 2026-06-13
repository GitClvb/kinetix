package com.kinetix.fit.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PedidoResponse {

    private Integer idPedido;
    private Integer idPago;
    private BigDecimal total;
    private String estadoPedido;
    private String estadoPago;
    private LocalDateTime fechaPedido;

    public PedidoResponse() {}

    public PedidoResponse(Integer idPedido, Integer idPago, BigDecimal total, String estadoPedido, String estadoPago, LocalDateTime fechaPedido) {
        this.idPedido  = idPedido;
        this.idPago = idPago;
        this.total = total;
        this.estadoPedido = estadoPedido;
        this.estadoPago   = estadoPago;
        this.fechaPedido  = fechaPedido;
    }

    public String getEstadoPago() {
        return estadoPago;
    }

    public void setEstadoPago(String estadoPago) {
        this.estadoPago = estadoPago;
    }

    public String getEstadoPedido() {
        return estadoPedido;
    }

    public void setEstadoPedido(String estadoPedido) {
        this.estadoPedido = estadoPedido;
    }

    public LocalDateTime getFechaPedido() {
        return fechaPedido;
    }

    public void setFechaPedido(LocalDateTime fechaPedido) {
        this.fechaPedido = fechaPedido;
    }

    public Integer getIdPago() {
        return idPago;
    }

    public void setIdPago(Integer idPago) {
        this.idPago = idPago;
    }

    public Integer getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(Integer idPedido) {
        this.idPedido = idPedido;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}