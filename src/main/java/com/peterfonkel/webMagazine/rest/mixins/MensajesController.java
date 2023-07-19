package com.peterfonkel.webMagazine.rest.mixins;


import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

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

import com.peterfonkel.webMagazine.entities.Categoria;
import com.peterfonkel.webMagazine.entities.Mensaje;
import com.peterfonkel.webMagazine.repositories.CategoriaDAO;
import com.peterfonkel.webMagazine.services.CategoriaService;
import com.peterfonkel.webMagazine.services.MensajesService;

@RepositoryRestController
@RequestMapping(path = "/api/mensajes/search")
@CrossOrigin
public class MensajesController {
	
	@Autowired
	MensajesService mensajeService;
	
	public MensajesController(){
	}
	
	public MensajesService getMensajeService() {
		return mensajeService;
	}

	@GetMapping(path = "mensajes")
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER') OR hasRole('ROLE_USER_MEMBER')")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getMensajes(PersistentEntityResourceAssembler assembler) {
	    List<Mensaje> mensajes = getMensajeService().findAll();
	    mensajes.sort(Comparator.comparing(Mensaje::getFecha)); // Ordenar por fecha de más antiguo a más moderno
	    return assembler.toCollectionModel(mensajes);
	}

	
	@PostMapping(path="postMensaje")
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER') OR hasRole('ROLE_USER_MEMBER')")
	@ResponseBody
	public PersistentEntityResource postMensaje(PersistentEntityResourceAssembler assembler, @RequestBody Mensaje mensaje) {
		return assembler.toModel(getMensajeService().save(mensaje));
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@DeleteMapping(path = "deleteMensaje/{id}")
	@ResponseBody
	public void deleteMensajeById(PersistentEntityResourceAssembler assembler,@PathVariable("id") Long id) {
		getMensajeService().deleteById(id);
	}
	
	
}
