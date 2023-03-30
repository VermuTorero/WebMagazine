package com.peterfonkel.WebMagazine.entities;

import java.sql.Date;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;


@Entity
public class Cafe {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	private Date fechaCafe;
	

	public Cafe() {
		super();
	}

	public Cafe(Date fechaCafe) {
		super();
		this.fechaCafe = fechaCafe;
	}

	
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Date getFechaCafe() {
		return fechaCafe;
	}

	public void setFechaCafe(Date fechaCafe) {
		this.fechaCafe = fechaCafe;
	}
	
	
	
}
