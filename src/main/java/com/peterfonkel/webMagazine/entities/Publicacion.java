package com.peterfonkel.webMagazine.entities;

import java.time.Instant;



import java.util.List;
import java.util.Set;

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

import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;




@Entity
public class Publicacion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	@Column(unique = true)
	private String titulo;
	
	@Column(length = 300)
	private String subtitulo;
	
	@Column(length=50000)
	private String htmlPublicacion;
	
	private boolean premium;
	
	private boolean destacado;
	
	private boolean carousel;

	@OneToOne(fetch = FetchType.LAZY, orphanRemoval = false)
	private Usuario autor;
	
	private Instant fechaPublicacion;
	
	@Column(length = 600)
	private String imagenPreviewUrl;
	
	@ManyToOne
	private Lugar lugar;
	
	@ManyToOne
	private Categoria categoria;
	
	private String url;
	
	private boolean publicado;
	
	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "publicacion_id")
	private Set<Like> likesRecibidos;
	
	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "publicacion_id")
	private List<Invitacion> invitaciones;
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "publicacion_id")
	private List<Tag> tags;
	
	private boolean letraOscura;
	
	private String[] keyWords;
	
	public Publicacion() {
		super();
	}

	public Publicacion(String titulo, String subtitulo, boolean isPremium, boolean isDestacado, Usuario autor, Instant fechaPublicacion, Set<Like> likesRecibidos, List<Invitacion> invitaciones, List<Tag> tags ) {
		this();
		this.titulo = titulo;
		this.subtitulo = subtitulo;
		this.premium = isPremium;
		this.destacado = isDestacado;
		this.autor = autor;
		this.fechaPublicacion = fechaPublicacion;
		this.likesRecibidos = likesRecibidos;
		this.invitaciones = invitaciones;
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

	public Usuario getAutor() {
		return autor;
	}

	public void setAutor(Usuario autor) {
		this.autor = autor;
	}

	public Instant getFechaPublicacion() {
		return fechaPublicacion;
	}

	public void setFechaPublicacion(Instant fechaPublicacion) {
		this.fechaPublicacion = fechaPublicacion;
	}

	public Set<Like> getLikesRecibidos() {
		return likesRecibidos;
	}

	public void setLikesRecibidos(Set<Like> likesRecibidos) {
		this.likesRecibidos = likesRecibidos;
	}

	public List<Invitacion> getInvitaciones() {
		return invitaciones;
	}

	public void setInvitaciones(List<Invitacion> invitaciones) {
		this.invitaciones = invitaciones;
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

	public Lugar getLugar() {
		return lugar;
	}

	public void setLugar(Lugar lugar) {
		this.lugar = lugar;
	}

	public Categoria getCategoria() {
		return categoria;
	}

	public void setCategoria(Categoria categoria) {
		this.categoria = categoria;
	}

	public boolean isCarousel() {
		return carousel;
	}

	public void setCarousel(boolean carousel) {
		this.carousel = carousel;
	}

	public boolean isLetraOscura() {
		return letraOscura;
	}

	public void setLetraOscura(boolean letraOscura) {
		this.letraOscura = letraOscura;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public boolean isPublicado() {
		return publicado;
	}
	

	public void setPublicado(boolean publicado) {
		this.publicado = publicado;
	}

	public String[] getKeyWords() {
		return keyWords;
	}

	public void setKeyWords(String[] keyWords) {
		this.keyWords = keyWords;
	}


	
	
}
