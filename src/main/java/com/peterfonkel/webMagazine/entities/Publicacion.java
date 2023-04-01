package com.peterfonkel.webMagazine.entities;

import java.util.Date;


import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;




@Entity
public class Publicacion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	
	private String titulo;
	
	private String subtitulo;
	
	private boolean isPremium;
	
	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "publicacion_id")
	private List<Bloque> bloques;
	
	@OneToOne(fetch = FetchType.EAGER, orphanRemoval = false)
	private Autor autor;
	
	private Date fechaPublicacion;
	
	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "publicacion_id")
	private List<Like> likesRecibidos;
	
	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "publicacion_id")
	private List<Cafe> cafes;
	
	
	
	public Publicacion() {
		super();
	}

	public Publicacion(String titulo, String subtitulo, Autor autor, Date fechaPublicacion) {
		this();
		this.titulo = titulo;
		this.subtitulo = subtitulo;
		this.autor = autor;
		this.fechaPublicacion = fechaPublicacion;
	}

	
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitulo() {
		return titulo;
	}

	public void setTitulo(String titulo) {
		this.titulo = titulo;
	}

	public String getSubtitulo() {
		return subtitulo;
	}

	public void setSubtitulo(String subtitulo) {
		this.subtitulo = subtitulo;
	}


	public Autor getAutor() {
		return autor;
	}

	public void setAutor(Autor autor) {
		this.autor = autor;
	}

	public Date getFechaPublicacion() {
		return fechaPublicacion;
	}

	public void setFechaPublicacion(Date fechaPublicacion) {
		this.fechaPublicacion = fechaPublicacion;
	}


	public List<Like> getLikesRecibidos() {
		return likesRecibidos;
	}

	public void setLikesRecibidos(List<Like> likesRecibidos) {
		this.likesRecibidos = likesRecibidos;
	}

	public List<Cafe> getCafes() {
		return cafes;
	}

	public void setCafes(List<Cafe> cafes) {
		this.cafes = cafes;
	}

	public boolean isPremium() {
		return isPremium;
	}

	public void setPremium(boolean isPremium) {
		this.isPremium = isPremium;
	}

	public List<Bloque> getBloques() {
		return bloques;
	}

	public void setBloques(List<Bloque> bloques) {
		this.bloques = bloques;
	}


	
}
