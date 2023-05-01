package com.peterfonkel.webMagazine.entities;

import java.time.Instant;
import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

@Entity
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPedido;
    private Instant fechaPedido;
    private Instant fechaEnvio;
    private Instant fechaEntrega;

    @OneToOne(fetch = FetchType.EAGER, orphanRemoval = false)
    private Direccion direccionEntrega;

    @OneToOne(fetch = FetchType.EAGER, orphanRemoval = false)
    private Usuario usuario;

    @OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "pedido_id")
    private List<Producto> Productos;
    private Float precioTotal;
    private boolean isCerrado;

    public Long getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(Long idPedido) {
        this.idPedido = idPedido;
    }

    public Instant getFechaPedido() {
        return fechaPedido;
    }

    public void setFechaPedido(Instant fechaPedido) {
        this.fechaPedido = fechaPedido;
    }

    public Instant getFechaEnvio() {
        return fechaEnvio;
    }

    public Instant setFechaEnvio(Instant fechaEnvio) {
        return this.fechaEnvio = fechaEnvio;
    }

    public Instant getFechaEntrega() {
        return fechaEntrega;
    }

    public Instant setFechaEntrega(Instant fechaEntrega) {
        return this.fechaEntrega = fechaEntrega;
    }

    public Direccion getDireccionEntrega() {
        return direccionEntrega;
    }

    public void setDireccionEntrega(Direccion direccionEntrega) {
        this.direccionEntrega = direccionEntrega;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public List<Producto> getProductos() {
        return Productos;
    }

    public void setProductos(List<Producto> productos) {
        Productos = productos;
    }

    public Float getPrecioTotal() {
        return precioTotal;
    }

    public void setPrecioTotal(Float precioTotal) {
        this.precioTotal = precioTotal;
    }

    public boolean isCerrado() {
        return isCerrado;
    }

    public void setCerrado(boolean isCerrado) {
        this.isCerrado = isCerrado;
    }

    public Pedido() {
    }

    public void addProducto(Producto producto){
        this.Productos.add(producto);
    }

}
