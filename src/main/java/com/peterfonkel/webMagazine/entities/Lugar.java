package com.peterfonkel.webMagazine.entities;



import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Lugar {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	@Column(unique = true)
	private String lugarNombre;
	
	public Lugar() {
		super();
	}
	public Lugar(String tagNombre) {
		this();
		this.lugarNombre = tagNombre;
	}
	public String getLugarNombre() {
		return lugarNombre;
	}
	public void setLugarNombre(String lugarNombre) {
		this.lugarNombre = lugarNombre;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	
	
}
