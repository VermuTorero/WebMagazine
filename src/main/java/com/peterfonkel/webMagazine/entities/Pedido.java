package com.peterfonkel.webMagazine.entities;

import java.time.Instant;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;

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
	@JoinColumn(name = "pedidoProducto_id")
    private List<PedidoProducto> productos;
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

    public List<PedidoProducto> getProductos() {
        return productos;
    }

    public void setProductos(List<PedidoProducto> productos) {
        this.productos = productos;
    }

    public Float getPrecioTotal() {
        return precioTotal;
    }

    public void setPrecioTotal(Float precioTotal) {
        this.precioTotal = precioTotal;
    }

    @JsonProperty("isCerrado")
    public boolean getIsCerrado() {
        return isCerrado;
    }

    public void setCerrado(boolean isCerrado) {
        this.isCerrado = isCerrado;
    }

    public Pedido() {
    }

    public void addProducto(PedidoProducto producto){
        this.productos.add(producto);
        producto.setPedido(this);
    }

}
