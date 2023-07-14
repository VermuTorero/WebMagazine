package com.peterfonkel.webMagazine.rest.mixins;


import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.PersistentEntityResource;
import org.springframework.data.rest.webmvc.PersistentEntityResourceAssembler;
import org.springframework.data.rest.webmvc.RepositoryRestController;
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
import com.peterfonkel.webMagazine.entities.PaginaEditable;
import com.peterfonkel.webMagazine.repositories.CategoriaDAO;
import com.peterfonkel.webMagazine.repositories.PaginaEditableDAO;
import com.peterfonkel.webMagazine.services.PaginaEditableService;

@RepositoryRestController
@RequestMapping(path = "api/paginaEditables/search")
@CrossOrigin
public class PaginaEditableController {
	
	
	@Autowired
	PaginaEditableService paginaEditableService;
	
	public PaginaEditableController(){;
	}
	
	public PaginaEditableService getPaginaEditableService() {
		return paginaEditableService;
	}

	@GetMapping(path = "paginaEditableByNombrePagina/{nombrePagina}")
	@ResponseBody
	public PersistentEntityResource getPaginaByNombrePagina(PersistentEntityResourceAssembler assembler,@PathVariable("nombrePagina") String nombrePagina) {
		PaginaEditable paginaEditable = getPaginaEditableService().findByNombrePagina(nombrePagina);
		return assembler.toModel(paginaEditable);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PatchMapping(path = "patchPaginaEditable/{id}")
	@ResponseBody
	public PersistentEntityResource patchPagina(PersistentEntityResourceAssembler assembler,@PathVariable("id") Long id, @RequestBody PaginaEditable paginaNueva ) {
		PaginaEditable paginaEditable = getPaginaEditableService().findById(id);
		paginaEditable.setHtml(paginaNueva.getHtml());
		getPaginaEditableService().save(paginaEditable);
		return assembler.toModel(paginaEditable);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping(path = "postPaginaEditable")
	@ResponseBody
	public PersistentEntityResource postPagina(PersistentEntityResourceAssembler assembler, @RequestBody PaginaEditable paginaNueva ) {
		getPaginaEditableService().save(paginaNueva);
		PaginaEditable paginaGuardada = getPaginaEditableService().findByNombrePagina(paginaNueva.getNombrePagina());
		return assembler.toModel(paginaGuardada);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@DeleteMapping(path = "deletePagina/{id}")
	@ResponseBody
	public void postPagina(PersistentEntityResourceAssembler assembler, @PathVariable("id") Long id) {
		getPaginaEditableService().deleteById(id);
	}
	
}
