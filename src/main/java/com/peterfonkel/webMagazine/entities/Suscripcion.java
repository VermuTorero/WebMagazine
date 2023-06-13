package com.peterfonkel.webMagazine.entities;

import java.time.Instant;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;

@Entity
public class Suscripcion {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	private Instant fechaInicio;
	private Instant fechaFin;
	@ManyToOne(fetch = FetchType.EAGER)
	private TipoSuscripcion tipoSuscripcion;
	
	public Suscripcion() {
		super();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Instant getFechaInicio() {
		return fechaInicio;
	}
	
	public void setFechaInicio(Instant fechaInicio) {
		this.fechaInicio = fechaInicio;
	}
	
	public Instant getFechaFin() {
		return fechaFin;
	}
	public void setFechaFin(Instant fechaFin) {
		this.fechaFin = fechaFin;
	}

	public TipoSuscripcion getTipoSuscripcion() {
		return tipoSuscripcion;
	}

	public void setTipoSuscripcion(TipoSuscripcion tipoSuscripcion) {
		this.tipoSuscripcion = tipoSuscripcion;
	}
	
}
