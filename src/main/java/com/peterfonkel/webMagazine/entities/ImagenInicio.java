package com.peterfonkel.webMagazine.entities;

import java.sql.Date;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;


@Entity
public class ImagenInicio {

	@Id
	Long id;
	private String url;
	private boolean derecha;
	

	public ImagenInicio() {
		super();
	}

	
	
	public ImagenInicio(Long id, String url, boolean derecha) {
		super();
		this.url = url;
		this.derecha = derecha;
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



	public boolean isDerecha() {
		return derecha;
	}



	public void setDerecha(boolean derecha) {
		this.derecha = derecha;
	}

}
