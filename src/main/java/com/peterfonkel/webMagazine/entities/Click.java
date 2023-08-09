package com.peterfonkel.webMagazine.entities;

import java.time.Instant;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;

import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;

@Entity
public class Click {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToMany
	private Categoria categoriaClick;
	@ManyToMany
	private List<Tag> tagsClick;
	private Instant fechaClick;
	@ManyToOne
	private Usuario usuario;
	
	public Click() {
		super();
	}

	public Categoria getCategoriaClick() {
		return categoriaClick;
	}

	public void setCategoriaClick(Categoria categoriaClick) {
		this.categoriaClick = categoriaClick;
	}

	public List<Tag> getTagsClick() {
		return tagsClick;
	}

	public void setTagsClick(List<Tag> tagsClick) {
		this.tagsClick = tagsClick;
	}

	public Instant getFechaClick() {
		return fechaClick;
	}

	public void setFechaClick(Instant fechaClick) {
		this.fechaClick = fechaClick;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}
	
	
	
}
