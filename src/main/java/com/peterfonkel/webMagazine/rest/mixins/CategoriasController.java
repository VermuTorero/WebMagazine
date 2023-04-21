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
import com.peterfonkel.webMagazine.repositories.CategoriaDAO;

@RepositoryRestController
@RequestMapping(path = "/categorias/search")
@CrossOrigin
public class CategoriasController {
	
	
	@Autowired
	CategoriaDAO categoriaDAO;
	
	
	public CategoriasController(CategoriaDAO categoriaDAO){
		this.categoriaDAO = categoriaDAO;
	}
	
	@GetMapping(path = "categoriaByCategoriaNombre/{categoriaNombre}")
	@ResponseBody
	public PersistentEntityResource getPublicacionByTitulo(PersistentEntityResourceAssembler assembler,@PathVariable("categoriaNombre") String categoriaNombre) {
		Categoria categoria = categoriaDAO.findByCategoriaNombre(categoriaNombre);
		return assembler.toModel(categoria);
	}
	
	
}
