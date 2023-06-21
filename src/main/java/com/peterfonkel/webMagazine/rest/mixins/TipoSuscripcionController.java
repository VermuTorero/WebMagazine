package com.peterfonkel.webMagazine.rest.mixins;


import java.util.ArrayList;

import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
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

import com.peterfonkel.webMagazine.entities.TipoSuscripcion;
import com.peterfonkel.webMagazine.repositories.TipoSuscripcionDAO;

@RepositoryRestController
@RequestMapping(path = "/tipoSuscripcions/search")
@CrossOrigin
public class TipoSuscripcionController {
	
	
	@Autowired
	TipoSuscripcionDAO tipoSuscripcionDAO;
	
	public TipoSuscripcionController(TipoSuscripcionDAO tipoSuscripcionDAO){
		this.tipoSuscripcionDAO = tipoSuscripcionDAO;
	}
	
	@GetMapping(path = "suscripciones")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getSuscripciones(PersistentEntityResourceAssembler assembler) {
	    List<TipoSuscripcion> tipoSuscripciones = tipoSuscripcionDAO.findAll();
	    tipoSuscripciones.sort(Comparator.comparingLong(TipoSuscripcion::getId));
	    return assembler.toCollectionModel(tipoSuscripciones);
	}

	




	
	
}
