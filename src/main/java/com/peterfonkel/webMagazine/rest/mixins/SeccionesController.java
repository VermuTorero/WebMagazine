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
import com.peterfonkel.webMagazine.entities.Seccion;
import com.peterfonkel.webMagazine.repositories.CategoriaDAO;
import com.peterfonkel.webMagazine.services.CategoriaService;
import com.peterfonkel.webMagazine.services.SeccionService;

@RepositoryRestController
@RequestMapping(path = "/api/secciones/search")
@CrossOrigin
public class SeccionesController {
	
	@Autowired
	SeccionService seccionService;
	
	public SeccionesController(){
	}
	
	public SeccionService getSeccionesService() {
		return seccionService;
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping(path = "secciones")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getSecciones(PersistentEntityResourceAssembler assembler) {
		List<Seccion> secciones = getSeccionesService().findAll();
		return assembler.toCollectionModel(secciones);
	}
	
	@GetMapping(path = "seccion/{id}")
	@ResponseBody
	public PersistentEntityResource getSeccion(PersistentEntityResourceAssembler assembler, @PathVariable Long id) {
		Seccion seccion = getSeccionesService().findById(id);
		return assembler.toModel(seccion);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PatchMapping(path = "patchSeccion")
	@ResponseBody
	public PersistentEntityResource patchseccion(PersistentEntityResourceAssembler assembler, @RequestBody Seccion seccionNueva) {
		Seccion seccion = getSeccionesService().getById(seccionNueva.getId());
		seccion = seccionNueva;
		getSeccionesService().save(seccion);
		return assembler.toModel(seccion);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping(path = "postSeccion")
	@ResponseBody
	public PersistentEntityResource postseccion(PersistentEntityResourceAssembler assembler, @RequestBody Seccion seccionNueva) {
		Seccion seccion = getSeccionesService().save(seccionNueva);
		return assembler.toModel(seccion);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@DeleteMapping(path = "deleteseccion/{id}")
	@ResponseBody
	public void deleteSeccionById(PersistentEntityResourceAssembler assembler,@PathVariable("id") Long id) {
		getSeccionesService().deleteById(id);
	}
	
	
}
