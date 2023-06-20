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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.api.services.gmail.Gmail.Users.Settings.GetPop;
import com.peterfonkel.webMagazine.entities.CaracteristicaSuscripcion;
import com.peterfonkel.webMagazine.entities.Categoria;
import com.peterfonkel.webMagazine.entities.TipoSuscripcion;
import com.peterfonkel.webMagazine.repositories.CategoriaDAO;
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
	
	@GetMapping(path = "caractristicasByTipoSuscripcion/{idSuscripcion}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getCategoriaByTitulo(PersistentEntityResourceAssembler assembler,@PathVariable("idSuscripcion") Long idSuscripcion) {
		TipoSuscripcion tipoSuscripcion = tipoSuscripcionDAO.findById(idSuscripcion).get();
		List<CaracteristicaSuscripcion> caracteristicas = tipoSuscripcion.getCaracteristicas();
		return assembler.toCollectionModel(caracteristicas);
	}
	
	@PatchMapping(path = "patchSuscripciones")
	@ResponseBody
	public PersistentEntityResource patchSuscripcion(PersistentEntityResourceAssembler assembler,@RequestBody TipoSuscripcion tipoSuscripcion) {
		TipoSuscripcion tipoSuscripcionAntigua = tipoSuscripcionDAO.findById(tipoSuscripcion.getId()).get();
		tipoSuscripcionAntigua.setCaracteristicas(tipoSuscripcion.getCaracteristicas());
		tipoSuscripcionAntigua.setNombre(tipoSuscripcion.getNombre());
		tipoSuscripcionAntigua.setPrecio(tipoSuscripcion.getPrecio());
		tipoSuscripcionDAO.save(tipoSuscripcionAntigua);
		return assembler.toModel(tipoSuscripcionAntigua);
	}
	
	
}
