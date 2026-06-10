package com.kinetix.fit.dto;


import com.kinetix.fit.enums.EstadoPedido;

public class ActualizarEstadoPedidoRequest {

    private EstadoPedido estado;

    public EstadoPedido getEstado() {
        return estado;
    }

    public void setEstado(EstadoPedido estado) {
        this.estado = estado;
    }
}
