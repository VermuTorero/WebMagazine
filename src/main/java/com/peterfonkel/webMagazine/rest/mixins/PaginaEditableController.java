package com.peterfonkel.webMagazine.rest.mixins;


import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.PersistentEntityResource;
import org.springframework.data.rest.webmvc.PersistentEntityResourceAssembler;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.peterfonkel.webMagazine.entities.Categoria;
import com.peterfonkel.webMagazine.entities.PaginaEditable;
import com.peterfonkel.webMagazine.repositories.CategoriaDAO;
import com.peterfonkel.webMagazine.repositories.PaginaEditableDAO;

@RepositoryRestController
@RequestMapping(path = "/paginaEditables/search")
@CrossOrigin
public class PaginaEditableController {
	
	
	@Autowired
	PaginaEditableDAO paginaEditableDAO;
	
	
	public PaginaEditableController(PaginaEditableDAO paginaEditableDAO){
		this.paginaEditableDAO = paginaEditableDAO;
	}
	
	@GetMapping(path = "paginaEditableByNombrePagina/{nombrePagina}")
	@ResponseBody
	public PersistentEntityResource getPaginaByNombrePagina(PersistentEntityResourceAssembler assembler,@PathVariable("nombrePagina") String nombrePagina) {
		PaginaEditable paginaEditable = paginaEditableDAO.findByNombrePagina(nombrePagina);
		return assembler.toModel(paginaEditable);
	}
	
	
}
