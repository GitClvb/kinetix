package com.kinetix.fit.dto;


import com.kinetix.fit.enums.EstadoPago;

public class ActualizarEstadoPagoRequest {

    private EstadoPago estadoPago;

    public EstadoPago getEstadoPago() {
        return estadoPago;
    }

    public void setEstadoPago(
            EstadoPago estadoPago
    ) {
        this.estadoPago = estadoPago;
    }
}
