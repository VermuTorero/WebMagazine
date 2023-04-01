package com.peterfonkel.webMagazine.rest.mixins;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.PersistentEntityResource;
import org.springframework.data.rest.webmvc.PersistentEntityResourceAssembler;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.hateoas.CollectionModel;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.peterfonkel.webMagazine.entities.Usuario;
import com.peterfonkel.webMagazine.repositories.AutorDAO;
import com.peterfonkel.webMagazine.repositories.UsuarioDAO;

@RepositoryRestController
@RequestMapping(path = "/usuarios/search")
@CrossOrigin
public class UsuariosController {
	
	@Autowired
	UsuarioDAO usuarioDAO;
	
	@Autowired
	AutorDAO autorDAO;
	
	public UsuariosController(UsuarioDAO usuarioDAO, AutorDAO autorDAO){
		this.usuarioDAO = usuarioDAO;
		this.autorDAO = autorDAO;
	}
	
	@GetMapping(path = "usuariosPremium")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getUsuariosPremium(PersistentEntityResourceAssembler assembler) {
		List<Usuario> listadoUsuarios = usuarioDAO.findAll();
		List<Usuario> listadoUsuariosPremium = new ArrayList<Usuario>();
		for (Usuario usuario : listadoUsuarios) {
			if (usuario.getSuscripcion().equals("premium")) {
				listadoUsuariosPremium.add(usuario);
			}
		}
		return assembler.toCollectionModel(listadoUsuariosPremium);
	}
	
	@GetMapping(path = "usuariosFree")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getUsuariosFree(PersistentEntityResourceAssembler assembler) {
		List<Usuario> listadoUsuarios = usuarioDAO.findAll();
		List<Usuario> listadoUsuariosFree = new ArrayList<Usuario>();
		for (Usuario usuario : listadoUsuarios) {
			if (usuario.getSuscripcion().equals("free")) {
				listadoUsuariosFree.add(usuario);
			}
		}
		return assembler.toCollectionModel(listadoUsuariosFree);
	}
	

	@GetMapping(path = "autores")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getAutores(PersistentEntityResourceAssembler assembler) {
		return assembler.toCollectionModel(autorDAO.findAll());
	}
}
