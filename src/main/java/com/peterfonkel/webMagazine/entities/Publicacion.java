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
	
	@Column(length=50000)
	private String htmlPublicacion;
	
	private boolean premium;
	
	private boolean destacado;

	@OneToOne(fetch = FetchType.EAGER, orphanRemoval = false)
	private Autor autor;
	
	private Instant fechaPublicacion;
	
	private String imagenPreviewUrl;
	
	
	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "publicacion_id")
	private List<Like> likesRecibidos;
	
	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "publicacion_id")
	private List<Cafe> cafes;
	
	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "publicacion_id")
	private List<Tag> tags;
	
	
	public Publicacion() {
		super();
	}

	public Publicacion(String titulo, String subtitulo, boolean isPremium, boolean isDestacado, Autor autor, Instant fechaPublicacion, List<Like> likesRecibidos, List<Cafe> cafes, List<Tag> tags ) {
		this();
		this.titulo = titulo;
		this.subtitulo = subtitulo;
		this.premium = isPremium;
		this.destacado = isDestacado;
		this.autor = autor;
		this.fechaPublicacion = fechaPublicacion;
		this.likesRecibidos = likesRecibidos;
		this.cafes = cafes;
		this.tags = tags;
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


	public String getHtmlPublicacion() {
		return htmlPublicacion;
	}

	public void setHtmlPublicacion(String htmlPublicacion) {
		this.htmlPublicacion = htmlPublicacion;
	}

	public Autor getAutor() {
		return autor;
	}

	public void setAutor(Autor autor) {
		this.autor = autor;
	}

	public Instant getFechaPublicacion() {
		return fechaPublicacion;
	}

	public void setFechaPublicacion(Instant fechaPublicacion) {
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

	public List<Tag> getTags() {
		return tags;
	}

	public void setTags(List<Tag> tags) {
		this.tags = tags;
	}

	public boolean isPremium() {
		return premium;
	}

	public void setPremium(boolean premium) {
		this.premium = premium;
	}

	public boolean isDestacado() {
		return destacado;
	}

	public void setDestacado(boolean destacado) {
		this.destacado = destacado;
	}

	public String getImagenPreviewUrl() {
		return imagenPreviewUrl;
	}

	public void setImagenPreviewUrl(String imagenPreviewUrl) {
		this.imagenPreviewUrl = imagenPreviewUrl;
	}


	
}
