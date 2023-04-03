package com.peterfonkel.webMagazine.entities;

import javax.persistence.Entity;

@Entity
public class ImagenPublicacion extends Bloque {

	private String urlImagen;

	public ImagenPublicacion() {
		super();
	}

	public ImagenPublicacion(String urlImagen) {
		this();
		this.urlImagen = urlImagen;
	}

	public String getUrlImagen() {
		return urlImagen;
	}

	public void setUrlImagen(String urlImagen) {
		this.urlImagen = urlImagen;
	}
	
	
}
