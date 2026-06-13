package com.kinetix.fit.model;

import com.kinetix.fit.enums.EstadoPago;
import com.kinetix.fit.enums.MetodoPago;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagos")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago")
    private Integer idPago;

    @ManyToOne
    @JoinColumn(name = "id_pedido", nullable = false)
    private Pedido pedido;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago", nullable = false)
    private MetodoPago metodoPago;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_pago", nullable = false)
    private EstadoPago estadoPago;

    @Column(length = 150)
    private String referencia;

    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;

    public Pago(EstadoPago estadoPago, LocalDateTime fechaPago, Integer idPago, MetodoPago metodoPago, Pedido pedido, String referencia) {
        this.estadoPago = estadoPago;
        this.fechaPago = fechaPago;
        this.idPago = idPago;
        this.metodoPago = metodoPago;
        this.pedido = pedido;
        this.referencia = referencia;
    }

    public Pago(){}

    public EstadoPago getEstadoPago() {
        return estadoPago;
    }

    public void setEstadoPago(EstadoPago estadoPago) {
        this.estadoPago = estadoPago;
    }

    public LocalDateTime getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(LocalDateTime fechaPago) {
        this.fechaPago = fechaPago;
    }

    public Integer getIdPago() {
        return idPago;
    }

    public void setIdPago(Integer idPago) {
        this.idPago = idPago;
    }

    public MetodoPago getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(MetodoPago metodoPago) {
        this.metodoPago = metodoPago;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    public String getReferencia() {
        return referencia;
    }

    public void setReferencia(String referencia) {
        this.referencia = referencia;
    }

    @Override
    public String toString() {
        return "Pago{" +
                "estadoPago=" + estadoPago +
                ", idPago=" + idPago +
                ", pedido=" + pedido +
                ", metodoPago=" + metodoPago +
                ", referencia='" + referencia + '\'' +
                ", fechaPago=" + fechaPago +
                '}';
    }
}