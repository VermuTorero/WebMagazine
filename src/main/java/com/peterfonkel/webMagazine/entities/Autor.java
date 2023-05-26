package com.peterfonkel.webMagazine.entities;


import java.util.List;



import javax.persistence.Entity;


import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;

@Entity
public class Autor extends Usuario {
	
	private String urlImagen;

	public Autor() {
		super();
	}
	public Autor(String nombre, String apellido1, String apellido2, String edad, String suscripcion,
			List<Like> likes, List<Invitacion> invitaciones) {
		this();
		this.setNombre(nombre);
		this.setApellido1(apellido1);
		this.setApellido2(apellido2);
		this.setEdad(edad);
		this.setSuscripcion(suscripcion);
		this.setLikes(likes);
		this.setInvitaciones(invitaciones);
	}
	public String getUrlImagen() {
		return urlImagen;
	}
	public void setUrlImagen(String urlImagen) {
		this.urlImagen = urlImagen;
	}

}
