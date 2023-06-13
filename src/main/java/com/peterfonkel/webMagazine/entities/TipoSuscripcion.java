package com.peterfonkel.webMagazine.entities;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.peterfonkel.webMagazine.login.roles.Rol;

@Entity
public class TipoSuscripcion {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
	private String nombre;
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "tiposuscripcion_id")
	private List<CaracteristicaSuscripcion> caracteristicas;
	
	private float precio;
	
	@OneToOne(fetch = FetchType.EAGER)
	private Rol rol;
	
	public TipoSuscripcion() {
		super();
	}
	
	public String getNombre() {
		return nombre;
	}
	
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	
	public List<CaracteristicaSuscripcion> getCaracteristicas() {
		return caracteristicas;
	}
	
	public void setCaracteristicas(List<CaracteristicaSuscripcion> caracteristicas) {
		this.caracteristicas = caracteristicas;
	}
	
	public Rol getRol() {
		return rol;
	}
	
	public void setRol(Rol rol) {
		this.rol = rol;
	}
	
	public float getPrecio() {
		return precio;
	}
	
	public void setPrecio(float precio) {
		this.precio = precio;
	}
	
	public Long getId() {
		return id;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
}
