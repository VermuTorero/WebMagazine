package com.peterfonkel.webMagazine.entities;

import java.time.Instant;
import java.util.Date;


import java.util.List;

import javax.persistence.Column;
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




@Entity
public class PaginaEditable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	@Column(length=50000)
	private String html;
	
	private String nombrePagina;
	
	public PaginaEditable() {
		super();
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}


	public String getHtml() {
		return html;
	}

	public void setHtml(String html) {
		this.html = html;
	}

	public String getNombrePagina() {
		return nombrePagina;
	}

	public void setNombrePagina(String nombrePagina) {
		this.nombrePagina = nombrePagina;
	}
	

}
