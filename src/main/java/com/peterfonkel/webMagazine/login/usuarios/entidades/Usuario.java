package com.peterfonkel.webMagazine.login.usuarios.entidades;

import com.peterfonkel.webMagazine.entities.Cafe;
import com.peterfonkel.webMagazine.entities.Direccion;
import com.peterfonkel.webMagazine.entities.Like;
import com.peterfonkel.webMagazine.login.roles.Rol;
import com.sun.istack.NotNull;
import javax.persistence.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * entidad que almacena la informacion de un usaurio, ID, mail, Password y roles
 * 
 * @author jl_pu
 *
 */

@Entity
public class Usuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull
	@Column(unique = true)
	private String email;

	@NotNull
	private String password;

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
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(joinColumns = @JoinColumn(name = "usuario_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "rol_id", referencedColumnName = "id"))
	private Set<Rol> roles = new HashSet<Rol>();

	public Usuario() {
	}

	public Usuario(String email, String password) {
		System.out.println("Email en const: " + email);
		System.out.println("Pass en const: " + password);
		this.email = email;
		this.password = password;
	}

	public Usuario(String email, Set<Rol> roles) {
		super();
		this.email = email;
		this.roles = roles;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Set<Rol> getRoles() {
		return roles;
	}

	public void setRoles(Rol[] roles) {
		this.roles = new HashSet<Rol>();
		for (Rol rol2 : roles) {
			this.roles.add(rol2);
		}
	}

	public void agregarRoles(Set<Rol> roles) {
		this.roles = roles;
	}

	public Rol getRol() {
		Rol rolUsuario = new Rol();
		for (Rol rol : roles) {
			rolUsuario = rol;
		}
		return rolUsuario;
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

	public void setSuscripcion(String suscripcion) {
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

	public void setRoles(Set<Rol> roles) {
		this.roles = roles;
	}

	@Override
	public String toString() {
		return "Usuario [id=" + id + ", email=" + email + ", password=" + password + ", roles=" + roles + "]";
	}

}
