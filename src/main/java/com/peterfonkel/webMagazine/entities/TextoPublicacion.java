package com.peterfonkel.webMagazine.entities;

import javax.persistence.Entity;

@Entity
public class TextoPublicacion extends Bloque{

	private String texto;
	
	private boolean isNegrita;
	
	private boolean isCursiva;
	
	private int tamano ;

	public TextoPublicacion() {
		super();
	}

	public TextoPublicacion(String texto, boolean isNegrita, boolean isCursiva, int tamano) {
		this();
		this.texto = texto;
		this.isNegrita = isNegrita;
		this.isCursiva = isCursiva;
		this.tamano = tamano;
	}

	public String getTexto() {
		return texto;
	}

	public void setTexto(String texto) {
		this.texto = texto;
	}

	public boolean isNegrita() {
		return isNegrita;
	}

	public void setNegrita(boolean isNegrita) {
		this.isNegrita = isNegrita;
	}

	public boolean isCursiva() {
		return isCursiva;
	}

	public void setCursiva(boolean isCursiva) {
		this.isCursiva = isCursiva;
	}

	public int getTamano() {
		return tamano;
	}

	public void setTamano(int tamano) {
		this.tamano = tamano;
	}
	
	
	
	
}
