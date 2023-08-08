package com.peterfonkel.webMagazine.rest.mixins;


import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.PersistentEntityResource;
import org.springframework.data.rest.webmvc.PersistentEntityResourceAssembler;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.hateoas.CollectionModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.peterfonkel.webMagazine.entities.Categoria;
import com.peterfonkel.webMagazine.entities.Click;
import com.peterfonkel.webMagazine.entities.Tag;
import com.peterfonkel.webMagazine.repositories.CategoriaDAO;
import com.peterfonkel.webMagazine.services.CategoriaService;
import com.peterfonkel.webMagazine.services.ClickService;
import com.peterfonkel.webMagazine.services.TagService;

@RepositoryRestController
@RequestMapping(path = "/api/clicks/search")
@CrossOrigin
public class ClickController {
	
	@Autowired
	ClickService clickService;
	
	@Autowired
	TagService tagService;
	
	@Autowired
	CategoriaService categoriaService;
	
	public ClickController(){
	}
	
	public ClickService getClickService() {
		return clickService;
	}
	
	public TagService getTagService() {
		return tagService;
	}
	
	public CategoriaService getCategoriaService() {
		return categoriaService;
	}

	@PostMapping(path = "postClick") 
	@ResponseBody
	public PersistentEntityResource postClick(PersistentEntityResourceAssembler assembler, @RequestBody Click click) {
		Click nuevoClick = click;
		nuevoClick.setFechaClick(Instant.now());
		return assembler.toModel(getClickService().save(nuevoClick));
	}
	
	
	@GetMapping(path = "clicks")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getClicks(PersistentEntityResourceAssembler assembler) {
		List<Click> clicks = getClickService().findAll();
		return assembler.toCollectionModel(clicks);
	}
	
	@GetMapping(path = "clicksByUser/{id}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getClicksByUser(PersistentEntityResourceAssembler assembler, @PathVariable("id") Long id){
		List<Click> clicksUsuario = getClickService().findByUsuario_id(id);
		return assembler.toCollectionModel(clicksUsuario);
	}
	
	@GetMapping(path = "clicksByUserSince/{id}/{fecha}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getClicksByUser(PersistentEntityResourceAssembler assembler, @PathVariable("id") Long id, @PathVariable("fecha") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant fecha){
		List<Click> clicksUsuario = getClickService().findByUsuario_idAndFechaClickGreaterThan(id, fecha);
		return assembler.toCollectionModel(clicksUsuario);
	}
}
