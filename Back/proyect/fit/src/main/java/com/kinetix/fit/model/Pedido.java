package com.kinetix.fit.model;

import com.kinetix.fit.enums.EstadoPedido;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private Integer idPedido;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_direccion", nullable = false)
    private DireccionUsuario direccion;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPedido estado;

    @Column(name = "fecha_pedido")
    private LocalDateTime fechaPedido;

    public Pedido(DireccionUsuario direccion, EstadoPedido estado, LocalDateTime fechaPedido, Integer idPedido, BigDecimal total, Usuario usuario) {
        this.direccion = direccion;
        this.estado = estado;
        this.fechaPedido = fechaPedido;
        this.idPedido = idPedido;
        this.total = total;
        this.usuario = usuario;
    }

    public Pedido(){}

    public DireccionUsuario getDireccion() {
        return direccion;
    }

    public void setDireccion(DireccionUsuario direccion) {
        this.direccion = direccion;
    }

    public EstadoPedido getEstado() {
        return estado;
    }

    public void setEstado(EstadoPedido estado) {
        this.estado = estado;
    }

    public LocalDateTime getFechaPedido() {
        return fechaPedido;
    }

    public void setFechaPedido(LocalDateTime fechaPedido) {
        this.fechaPedido = fechaPedido;
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

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    @Override
    public String toString() {
        return "Pedido{" +
                "direccion=" + direccion +
                ", idPedido=" + idPedido +
                ", usuario=" + usuario +
                ", total=" + total +
                ", estado=" + estado +
                ", fechaPedido=" + fechaPedido +
                '}';
    }
}