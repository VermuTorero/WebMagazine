package com.peterfonkel.webMagazine.entities;

import java.time.Instant;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;

@Entity
public class Mensaje {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	private String texto;
	private String imagen;
	private Instant fecha;
	@ManyToOne(fetch = FetchType.LAZY)
	private Usuario usuario;
	
	public Mensaje() {
		super();
		this.fecha = Instant.now();
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getTexto() {
		return texto;
	}
	public void setTexto(String texto) {
		this.texto = texto;
	}
	public String getImagen() {
		return imagen;
	}
	public void setImagen(String imagen) {
		this.imagen = imagen;
	}

	public Instant getFecha() {
		return fecha;
	}
	public void setFecha(Instant fecha) {
		this.fecha = Instant.now();
	}
	public Usuario getUsuario() {
		return usuario;
	}
	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}
	
	

}
