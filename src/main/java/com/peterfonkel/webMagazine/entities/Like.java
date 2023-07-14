package com.peterfonkel.webMagazine.entities;

import java.time.Instant;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;




@Entity
@Table(name = "MeGusta")
public class Like {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	
	@OneToOne(fetch = FetchType.EAGER, orphanRemoval = false)
	private Usuario usuario;
	
	private Instant fechaLike;


	
	public Like() {
		super();
	}

	public Like(Usuario usuario, Instant fechaLike) {
		this();
		this.usuario = usuario;
		this.fechaLike = fechaLike;
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

	public Instant getFechaLike() {
		return fechaLike;
	}

	public void setFechaLike(Instant fechaLike) {
		this.fechaLike = fechaLike;
	}


}
