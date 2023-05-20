package com.peterfonkel.webMagazine.entities;

import java.sql.Date;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;



@Entity
public class Invitacion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	private Date fecha;
	private Float precio;
	

	public Invitacion() {
		super();
	}

	public Invitacion(Date fecha) {
		super();
		this.fecha = fecha;
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Date getFecha() {
		return fecha;
	}

	public void setFecha(Date fecha) {
		this.fecha = fecha;
	}

	public Float getPrecio() {
		return precio;
	}

	public void setPrecio(Float precio) {
		this.precio = precio;
	}
	
	
	
}
