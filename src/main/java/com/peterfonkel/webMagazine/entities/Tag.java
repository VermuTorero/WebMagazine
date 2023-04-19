package com.peterfonkel.webMagazine.entities;

import java.sql.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Tag {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	private String tagNombre;
	public Tag() {
		super();
	}
	public Tag(String tagNombre) {
		this();
		this.tagNombre = tagNombre;
	}
	public String getTagNombre() {
		return tagNombre;
	}
	public void setTagNombre(String tagNombre) {
		this.tagNombre = tagNombre;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	
	
}
