package com.peterfonkel.webMagazine.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Categoria {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String categoriaNombre;
	public Categoria() {
		super();
	}
	
	public Categoria(String categoriaNombre) {
		this();
		this.categoriaNombre = categoriaNombre;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCategoriaNombre() {
		return categoriaNombre;
	}

	public void setCategoriaNombre(String categoriaNombre) {
		this.categoriaNombre = categoriaNombre;
	}
	
	
}
