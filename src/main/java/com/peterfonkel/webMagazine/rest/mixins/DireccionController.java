package com.peterfonkel.webMagazine.rest.mixins;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.PersistentEntityResource;
import org.springframework.data.rest.webmvc.PersistentEntityResourceAssembler;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.hateoas.CollectionModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.peterfonkel.webMagazine.entities.Direccion;
import com.peterfonkel.webMagazine.login.jwt.JwtProvider;
import com.peterfonkel.webMagazine.login.usuarios.UsuarioDAO;
import com.peterfonkel.webMagazine.login.usuarios.UsuarioService;
import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;
import com.peterfonkel.webMagazine.repositories.DireccionDAO;
import com.peterfonkel.webMagazine.services.DireccionService;

@RepositoryRestController
@RequestMapping(path = "/direcciones/search")
@CrossOrigin
public class DireccionController {
	
	private final static Logger logger = LoggerFactory.getLogger(JwtProvider.class);

	@Autowired
	DireccionService direccionService;

	@Autowired
	UsuarioService usuarioService;
	
	public DireccionService getDireccionService() {
		return direccionService;
	}

	
	public UsuarioService getUsuarioService() {
		return usuarioService;
	}

	//Un usuario consulta sus direcciones
	@PreAuthorize("isAuthenticated()")
	@GetMapping(path = "getDireccionesFromUsuario")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getDireccionesFromToken(
			PersistentEntityResourceAssembler assembler, HttpServletRequest request) {
		Usuario usuario = getUsuarioService().getUsuarioFromToken(request);
		logger.info(usuario.getEmail() + " CONSULTA SUS DIRECCIONES");
		return assembler.toCollectionModel(usuario.getDirecciones());
	}
	
	//El admin consulta las direcciones de un usuario
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping(path = "getDireccionesFromUsuarioAdmin/{idUsuario}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getDireccionesFromTokenAdmin(
			PersistentEntityResourceAssembler assembler, HttpServletRequest request, @PathVariable Long idUsuario) {
		Usuario usuario = getUsuarioService().getUsuarioFromId(idUsuario);
		logger.info( "ADMIN CONSULTA LAS DIRECCIONES DE: " + usuario.getEmail());
		return assembler.toCollectionModel(usuario.getDirecciones());
	}
	
	//Un usuario crea una de sus direcciones
	@PreAuthorize("isAuthenticated()")
	@PostMapping(path = "crearDireccion")
	@ResponseBody
	public PersistentEntityResource postDireccion(PersistentEntityResourceAssembler assembler, HttpServletRequest request,
			@RequestBody Direccion direccion) {
		Usuario usuario = getUsuarioService().getUsuarioFromToken(request);
		direccion.setUsuario(usuario);
		getDireccionService().save(direccion);
		logger.info(usuario.getEmail() + " CREA DIRECCION: " + direccion);
		return assembler.toModel(direccion);
	}
	
	//El Admin crea la direccion de un usuario
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping(path = "crearDireccionAdmin/{id}")
	@ResponseBody
	public PersistentEntityResource postDireccionAdmin(PersistentEntityResourceAssembler assembler, HttpServletRequest request,
			@RequestBody Direccion direccion, @PathVariable Long id) {
		Usuario usuario = getUsuarioService().getUsuarioFromId(id);
		direccion.setUsuario(usuario);
		getDireccionService().save(direccion);
		logger.info("ADMIN CREA DIRECCION: " + direccion);
		return assembler.toModel(direccion);
	}
	
	//Un usuario borra una de sus direcciones
	@PreAuthorize("isAuthenticated()")
	@DeleteMapping(path = "eliminarDireccion/{idDireccion}")
	@ResponseBody
	public void eliminarDireccion(PersistentEntityResourceAssembler assembler, HttpServletRequest request, @PathVariable Long idDireccion) {
		Usuario usuario = getUsuarioService().getUsuarioFromToken(request);
		List<Direccion> direccionesNuevas = new ArrayList<>();
		for (Direccion direccion : usuario.getDirecciones()) {
			if (!direccion.getIdDireccion().equals(idDireccion)) {
				direccionesNuevas.add(direccion);
			}else{
				logger.info(usuario.getEmail() + "ELIMINA DIRECCION: " + direccion);
			}
		}
		usuario.setDirecciones(direccionesNuevas); 
		//La direccion no se borra, simplemente se saca de la lista de direcciones del usuario. Esto es porque puede estar metida en algun pedido.
		
	}
	
	//Un usuario modifica una de sus direcciones
	@PreAuthorize("isAuthenticated()")
	@PatchMapping(path = "patchDireccion")
	@ResponseBody
	public void eliminarDireccion(PersistentEntityResourceAssembler assembler, HttpServletRequest request, @RequestBody Direccion direccionModificada) {
		Usuario usuario = getUsuarioService().getUsuarioFromToken(request);
		List<Direccion> direccionesNuevas = new ArrayList<>();
		for (Direccion direccion : usuario.getDirecciones()) {
			if (!direccion.getIdDireccion().equals(direccionModificada.getIdDireccion())) {
				direccionesNuevas.add(direccion);
			}else {
				direccion = direccionModificada;
				direccionesNuevas.add(direccion);
				logger.info(usuario.getEmail() + "MODIFICA DIRECCION: " + direccion);
			}
		}
		usuario.setDirecciones(direccionesNuevas); 
		//La direccion no se borra, simplemente se saca de la lista de direcciones del usuario. Esto es porque puede estar metida en algun pedido.
	}
	
}
