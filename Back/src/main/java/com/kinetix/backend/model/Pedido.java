package com.kinetix.backend.model;

import com.kinetix.backend.common.EstadoPedido;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_direccion")
    private DireccionUsuario direccion;

    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    private EstadoPedido estado;

    @Column(name = "fecha_pedido")
    private LocalDateTime fechaPedido;

    public Pedido(Integer idPedido, Usuario usuario, DireccionUsuario direccion, BigDecimal total, EstadoPedido estado, LocalDateTime fechaPedido) {
        this.idPedido = idPedido;
        this.usuario = usuario;
        this.direccion = direccion;
        this.total = total;
        this.estado = estado;
        this.fechaPedido = fechaPedido;
    }

    public Pedido() { }

    public Integer getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(Integer idPedido) {
        this.idPedido = idPedido;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public DireccionUsuario getDireccion() {
        return direccion;
    }

    public void setDireccion(DireccionUsuario direccion) {
        this.direccion = direccion;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
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
}
