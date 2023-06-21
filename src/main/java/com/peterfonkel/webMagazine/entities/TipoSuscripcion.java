package com.peterfonkel.webMagazine.entities;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;

import com.peterfonkel.webMagazine.login.roles.Rol;

@Entity
public class TipoSuscripcion {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	private String nombre;
	
	private String caracteristica1;
	private String caracteristica2;
	private String caracteristica3;
	private String caracteristica4;
	private String caracteristica5;
	private String caracteristica6;
	private String caracteristica7;
	private String caracteristica8;
	
	private float precio;
	
	@OneToOne(fetch = FetchType.EAGER)
	private Rol rol;
	
	public TipoSuscripcion() {
		super();
	}
	
	public String getNombre() {
		return nombre;
	}
	
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	
	public Rol getRol() {
		return rol;
	}
	
	public void setRol(Rol rol) {
		this.rol = rol;
	}
	
	public float getPrecio() {
		return precio;
	}
	
	public void setPrecio(float precio) {
		this.precio = precio;
	}
	
	public Long getId() {
		return id;
	}
	
	public void setId(Long id) {
		this.id = id;
	}

	public String getCaracteristica1() {
		return caracteristica1;
	}

	public void setCaracteristica1(String caracteristica1) {
		this.caracteristica1 = caracteristica1;
	}

	public String getCaracteristica2() {
		return caracteristica2;
	}

	public void setCaracteristica2(String caracteristica2) {
		this.caracteristica2 = caracteristica2;
	}

	public String getCaracteristica3() {
		return caracteristica3;
	}

	public void setCaracteristica3(String caracteristica3) {
		this.caracteristica3 = caracteristica3;
	}

	public String getCaracteristica4() {
		return caracteristica4;
	}

	public void setCaracteristica4(String caracteristica4) {
		this.caracteristica4 = caracteristica4;
	}

	public String getCaracteristica5() {
		return caracteristica5;
	}

	public void setCaracteristica5(String caracteristica5) {
		this.caracteristica5 = caracteristica5;
	}

	public String getCaracteristica6() {
		return caracteristica6;
	}

	public void setCaracteristica6(String caracteristica6) {
		this.caracteristica6 = caracteristica6;
	}

	public String getCaracteristica7() {
		return caracteristica7;
	}

	public void setCaracteristica7(String caracteristica7) {
		this.caracteristica7 = caracteristica7;
	}

	public String getCaracteristica8() {
		return caracteristica8;
	}

	public void setCaracteristica8(String caracteristica8) {
		this.caracteristica8 = caracteristica8;
	}
	
}
