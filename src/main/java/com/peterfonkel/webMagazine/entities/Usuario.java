package com.peterfonkel.webMagazine.entities;


import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public class Usuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	
	private String nombre;
	
	private String apellido1;
	
	private String apellido2;
	
	private String edad;
	
	private String suscripcion;
	
	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "usuario_id")
	private List<Like> likes = new ArrayList<Like>();
	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "usuario_id")
	private List<Cafe> cafes = new ArrayList<Cafe>();

	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "usuario_id")
	private List<Direccion> direcciones = new ArrayList<Direccion>();
	
	
	public Usuario() {
		super();
	}

	public Usuario(String nombre, String apellido1, String apellido2, String edad, String suscripcion,
			List<Like> likes, List<Cafe> cafes) {
		this();
		this.nombre = nombre;
		this.apellido1 = apellido1;
		this.apellido2 = apellido2;
		this.edad = edad;
		this.suscripcion = suscripcion;
		this.likes = likes;
		this.cafes = cafes;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getApellido1() {
		return apellido1;
	}

	public void setApellido1(String apellido1) {
		this.apellido1 = apellido1;
	}

	public String getApellido2() {
		return apellido2;
	}

	public void setApellido2(String apellido2) {
		this.apellido2 = apellido2;
	}

	public String getEdad() {
		return edad;
	}

	public void setEdad(String edad) {
		this.edad = edad;
	}

	public String getSuscripcion() {
		return suscripcion;
	}

	public void setSuscripcion (String suscripcion) {
		this.suscripcion = suscripcion;
	}

	public List<Like> getLikes() {
		return likes;
	}

	public void setLikes(List<Like> likes) {
		this.likes = likes;
	}

	public List<Cafe> getCafes() {
		return cafes;
	}

	public void setCafes(List<Cafe> cafes) {
		this.cafes = cafes;
	}

	public List<Direccion> getDirecciones() {
		return direcciones;
	}

	public void setDirecciones(List<Direccion> direcciones) {
		this.direcciones = direcciones;
	}
	
	
	
	
}
