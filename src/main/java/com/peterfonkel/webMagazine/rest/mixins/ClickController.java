package com.peterfonkel.webMagazine.rest.mixins;


import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.peterfonkel.webMagazine.entities.Categoria;
import com.peterfonkel.webMagazine.entities.Click;
import com.peterfonkel.webMagazine.entities.Tag;
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

	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER') OR hasRole('ROLE_USER_MEMBER') OR hasRole('ROLE_USER_SUBSCRIBED') OR hasRole('ROLE_USER_REGISTERED')")
	@PostMapping(path = "postClick") 
	@ResponseBody
	public PersistentEntityResource postClick(PersistentEntityResourceAssembler assembler, @RequestBody Click click) {
		Categoria categoria = getCategoriaService().getById(click.getCategoriaClick().getId());
		Click nuevoClick = new Click();
		List<Tag> tagsClickNuevo = new ArrayList<>();
		if (click.getTagsClick().size()>0) {
			Tag tagNueva = new Tag();
			for (Tag tag : click.getTagsClick()) {
				tagNueva =  getTagService().getById(tag.getId());
				tagsClickNuevo.add(tagNueva);
			}
		}
		nuevoClick.setTagsClick(tagsClickNuevo);
		nuevoClick.setUsuario(click.getUsuario());
		nuevoClick.setCategoriaClick(categoria);
		nuevoClick.setFechaClick(Instant.now());
		return assembler.toModel(getClickService().save(nuevoClick));
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping(path = "clicks")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getClicks(PersistentEntityResourceAssembler assembler) {
		List<Click> clicks = getClickService().findAll();
		return assembler.toCollectionModel(clicks);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping(path = "clicksByUser/{id}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getClicksByUser(PersistentEntityResourceAssembler assembler, @PathVariable("id") Long id){
		List<Click> clicksUsuario = getClickService().findByUsuario_id(id);
		return assembler.toCollectionModel(clicksUsuario);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping(path = "clicksByUserSince/{id}/{fecha}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getClicksByUser(PersistentEntityResourceAssembler assembler, @PathVariable("id") Long id, @PathVariable("fecha") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant fecha){
		List<Click> clicksUsuario = getClickService().findByUsuario_idAndFechaClickGreaterThan(id, fecha);
		return assembler.toCollectionModel(clicksUsuario);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping(path = "tagsFromClick/{id}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getTagsFromCLick(PersistentEntityResourceAssembler assembler, @PathVariable("id") Long id) {
		Click click = getClickService().findById(id);
		List<Tag> tags = click.getTagsClick();
		return assembler.toCollectionModel(tags);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping(path = "clicksSince/{dias}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getClicksSince(PersistentEntityResourceAssembler assembler, @PathVariable int dias) {
	    Instant fechaLimite = Instant.now().minus(dias, ChronoUnit.DAYS);
	    List<Click> clicks = getClickService().findByFechaClickAfter(fechaLimite); // Cambiar esto según tu servicio

	    return assembler.toCollectionModel(clicks);
	}
}
