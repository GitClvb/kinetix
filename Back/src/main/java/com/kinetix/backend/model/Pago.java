package com.kinetix.backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import com.kinetix.backend.common.MetodoPago;

@Entity
@Table(name = "pagos")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago")
    private Integer idPago;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pedido")
    private Pedido pedido;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago")
    private MetodoPago metodoPago;

    private String referencia;

    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;

    public Pago(Integer idPago, Pedido pedido, MetodoPago metodoPago, String referencia, LocalDateTime fechaPago) {
        this.idPago = idPago;
        this.pedido = pedido;
        this.metodoPago = metodoPago;
        this.referencia = referencia;
        this.fechaPago = fechaPago;
    }

    public Pago() { }

    public Integer getIdPago() {
        return idPago;
    }

    public void setIdPago(Integer idPago) {
        this.idPago = idPago;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    public MetodoPago getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(MetodoPago metodoPago) {
        this.metodoPago = metodoPago;
    }

    public String getReferencia() {
        return referencia;
    }

    public void setReferencia(String referencia) {
        this.referencia = referencia;
    }

    public LocalDateTime getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(LocalDateTime fechaPago) {
        this.fechaPago = fechaPago;
    }
}
