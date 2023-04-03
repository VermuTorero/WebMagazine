package com.peterfonkel.webMagazine.rest.mixins;

import java.util.ArrayList;
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

import com.peterfonkel.webMagazine.entities.Publicacion;
import com.peterfonkel.webMagazine.entities.Usuario;
import com.peterfonkel.webMagazine.repositories.AutorDAO;
import com.peterfonkel.webMagazine.repositories.PublicacionDAO;
import com.peterfonkel.webMagazine.repositories.UsuarioDAO;

@RepositoryRestController
@RequestMapping(path = "/publicaciones/search")
@CrossOrigin
public class PublicacionesController {
	
	@Autowired
	PublicacionDAO publicacionDAO;
	
	
	
	public PublicacionesController(PublicacionDAO publicacionDAO){
		this.publicacionDAO = publicacionDAO;
	}
	
	@GetMapping(path = "publicacionesDestacadas")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesDestacadas(PersistentEntityResourceAssembler assembler) {
		List<Publicacion> listadoPublicaciones = publicacionDAO.findAll();
		List<Publicacion> listadoPublicacionesDestacadas = new ArrayList<Publicacion>();
		for (Publicacion publicacion : listadoPublicaciones) {
			if (publicacion.isDestacado()) {
				listadoPublicacionesDestacadas.add(publicacion);
			}
		}
		return assembler.toCollectionModel(listadoPublicacionesDestacadas);
	}
}
