package com.peterfonkel.webMagazine.entities;

import java.sql.Date;


import javax.persistence.Entity;
import javax.persistence.Id;



@Entity
public class ImagenInicio {

	@Id
	Long id;
	private String url;
	private String posicion;
	

	public ImagenInicio() {
		super();
	}

	public ImagenInicio(Long id, String url, String posicion) {
		super();
		this.url = url;
		this.posicion = posicion;
		this.id = id;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getPosicion() {
		return posicion;
	}

	public void setPosicion(String posicion) {
		this.posicion = posicion;
	}
}
