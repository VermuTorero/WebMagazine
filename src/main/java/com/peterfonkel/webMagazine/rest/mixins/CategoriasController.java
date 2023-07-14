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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.peterfonkel.webMagazine.entities.Categoria;
import com.peterfonkel.webMagazine.repositories.CategoriaDAO;
import com.peterfonkel.webMagazine.services.CategoriaService;

@RepositoryRestController
@RequestMapping(path = "/categorias/search")
@CrossOrigin
public class CategoriasController {
	
	@Autowired
	CategoriaService categoriaService;
	
	public CategoriasController(){
	}
	
	public CategoriaService getCategoriaService() {
		return categoriaService;
	}

	@GetMapping(path = "categoriaByCategoriaNombre/{categoriaNombre}")
	@ResponseBody
	public PersistentEntityResource getCategoriaByTitulo(PersistentEntityResourceAssembler assembler,@PathVariable("categoriaNombre") String categoriaNombre) {
		Categoria categoria = getCategoriaService().findByCategoriaNombre(categoriaNombre);
		return assembler.toModel(categoria);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@PatchMapping(path = "patchCategoria/{id}")
	@ResponseBody
	public PersistentEntityResource patchCategoriaById(PersistentEntityResourceAssembler assembler,@PathVariable("id") Long id, @RequestBody Categoria categoriaNueva) {
		Categoria categoria = getCategoriaService().findById(id);
		categoria = categoriaNueva;
		getCategoriaService().save(categoria);
		return assembler.toModel(categoria);
	}
	
	
}
