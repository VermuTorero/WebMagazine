package com.peterfonkel.webMagazine.login.usuarios.entidades;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import com.peterfonkel.webMagazine.entities.Direccion;
import com.peterfonkel.webMagazine.entities.Invitacion;
import com.peterfonkel.webMagazine.entities.Like;
import com.peterfonkel.webMagazine.entities.Suscripcion;
import com.peterfonkel.webMagazine.login.roles.Rol;
import com.sun.istack.NotNull;
import javax.persistence.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Entity
public class Usuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull
	@Column(unique = true)
	private String email;

	@JsonProperty(access = Access.WRITE_ONLY)
	@NotNull
	private String password;

	private String nombre;
	
	private String apellido1;
	
	private String apellido2;
	
	private String edad;
	
	private String urlImagen;
	
	private Instant fechaFinSuscripcion;
	
	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "usuario_id")
	private List<Invitacion> invitaciones = new ArrayList<Invitacion>();

	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "usuario_id")
	private List<Direccion> direcciones = new ArrayList<Direccion>();
	
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(joinColumns = @JoinColumn(name = "usuario_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "rol_id", referencedColumnName = "id"))
	private Set<Rol> roles = new HashSet<Rol>();
	
	@OneToOne(fetch = FetchType.LAZY)
	private Suscripcion suscripcion;
	
	@JsonProperty(access = Access.WRITE_ONLY)
	private String claveActivacion;
	
	@Column(unique = true)
	@JsonProperty(access = Access.WRITE_ONLY)
	private String claveRecuperacion;
	
	private Boolean isConfirmadoEmail;
	
	@ManyToOne
	private Rol rolSeleccionado;

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

	public void agregarRoles(Rol[] roles) {
		this.roles = new HashSet<Rol>();
		for (Rol rol2 : roles) {
			this.roles.add(rol2);
		}
	}

	public void setRoles(Set<Rol> roles) {
		this.roles = roles;
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

	public Suscripcion getSuscripcion() {
		return suscripcion;
	}

	public void setSuscripcion(Suscripcion suscripcion) {
		this.suscripcion = suscripcion;
	}

	public List<Direccion> getDirecciones() {
		return direcciones;
	}

	public void setDirecciones(List<Direccion> direcciones) {
		this.direcciones = direcciones;
	}


	public List<Invitacion> getInvitaciones() {
		return invitaciones;
	}

	public void setInvitaciones(List<Invitacion> invitaciones) {
		this.invitaciones = invitaciones;
	}
	

	public String getUrlImagen() {
		return urlImagen;
	}

	public void setUrlImagen(String urlImagen) {
		this.urlImagen = urlImagen;
	}

	public String getClaveActivacion() {
		return claveActivacion;
	}

	public void setClaveActivacion(String claveActivacion) {
		this.claveActivacion = claveActivacion;
	}

	public Boolean getIsConfirmadoEmail() {
		return isConfirmadoEmail;
	}

	public void setIsConfirmadoEmail(Boolean isConfirmadoEmail) {
		this.isConfirmadoEmail = isConfirmadoEmail;
	}
	
	
	public Rol getRolSeleccionado() {
		return rolSeleccionado;
	}

	public void setRolSeleccionado(Rol rolSeleccionado) {
		this.rolSeleccionado = rolSeleccionado;
	}

	public Instant getFechaFinSuscripcion() {
		return fechaFinSuscripcion;
	}

	public void setFechaFinSuscripcion(Instant fechaFinSuscripcion) {
		this.fechaFinSuscripcion = fechaFinSuscripcion;
	}
	

	public String getClaveRecuperacion() {
		return claveRecuperacion;
	}

	public void setClaveRecuperacion(String claveRecuperacion) {
		this.claveRecuperacion = claveRecuperacion;
	}
	
	public List<Direccion> addDireccion(Direccion direccion){
		this.direcciones.add(direccion);
		return this.direcciones;
	}

	@Override
	public String toString() {
		return "Usuario [id=" + id + ", nombre=" + nombre + ", apellido1=" + apellido1 +", email=" + email + ", password=" + password + ", roles=" + roles + "]";
	}

}
