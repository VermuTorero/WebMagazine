package com.peterfonkel.webMagazine.rest.mixins;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.PersistentEntityResource;
import org.springframework.data.rest.webmvc.PersistentEntityResourceAssembler;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.hateoas.CollectionModel;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.peterfonkel.webMagazine.entities.Publicacion;
import com.peterfonkel.webMagazine.entities.Tag;
import com.peterfonkel.webMagazine.entities.Usuario;
import com.peterfonkel.webMagazine.repositories.AutorDAO;
import com.peterfonkel.webMagazine.repositories.PublicacionDAO;
import com.peterfonkel.webMagazine.repositories.TagDAO;
import com.peterfonkel.webMagazine.repositories.UsuarioDAO;

@RepositoryRestController
@RequestMapping(path = "/publicaciones/search")
@CrossOrigin
public class PublicacionesController {
	
	@Autowired
	PublicacionDAO publicacionDAO;
	
	@Autowired
	TagDAO tagDAO;
	
	
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
	
	@PostMapping(path = "publicacionesCerca")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesCerca(PersistentEntityResourceAssembler assembler,@RequestBody Publicacion publicacionRelacionada) {
		List<Publicacion> listadoPublicaciones = publicacionDAO.findAll();
		List<Publicacion> listadoPublicacionesCerca = new ArrayList<Publicacion>();
		for (Publicacion publicacion : listadoPublicaciones) {
			if (publicacion.getProvincia().equals(publicacionRelacionada.getProvincia()) && !publicacion.getId().equals(publicacionRelacionada.getId())) {
				if(listadoPublicacionesCerca.size()<2) {
					listadoPublicacionesCerca.add(publicacion);
				}
				
			}
		}
		return assembler.toCollectionModel(listadoPublicacionesCerca);
	}
	
	@GetMapping(path = "publicacionesRelacionadas/{idPublicacion}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesRelacionadas(PersistentEntityResourceAssembler assembler,@PathVariable("idPublicacion") Long idPublicacion) {
		Publicacion publicacionRelacionada = publicacionDAO.getById(idPublicacion);
		List<Publicacion> listadoPublicaciones = publicacionDAO.findAll();
		List<Publicacion> listadoPublicacionesRelacionadas = new ArrayList<Publicacion>();
		int agregados = 0;
		
		for (Publicacion publicacion : listadoPublicaciones) {
			if (publicacion.getTitulo().equals(publicacionRelacionada.getTitulo())) {
				continue;
			}
			int gradoRelacion = 0;
			for (Tag tag : publicacion.getTags()) {
				System.out.println("TAG: " + tag.getTagNombre());
				for (Tag tagRecibida : publicacionRelacionada.getTags()) {
					if (tag.getTagNombre().equals(tagRecibida.getTagNombre())) {
						gradoRelacion++;
						System.out.println("GRADO DE RELACIÓN: " + gradoRelacion);
					}
				}
			}
			
			for (int i = 5; i > 0  ; i--) {
				if (gradoRelacion == i && agregados<2) {
					listadoPublicacionesRelacionadas.add(publicacion);
					agregados++;
				}
			}
			gradoRelacion = 0;
		}
		return assembler.toCollectionModel(listadoPublicacionesRelacionadas);
	}
	
	@GetMapping(path = "publicacionesByTag/{tagNombre}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesByTag(PersistentEntityResourceAssembler assembler,@PathVariable("tagNombre") String tagNombre) {
		
		List<Publicacion> listadoPublicaciones = publicacionDAO.findAll();
		List<Publicacion> listadoPublicacionesTag = new ArrayList<Publicacion>();
		for (Publicacion publicacion : listadoPublicaciones) {
			for (Tag tag : publicacion.getTags()) {
				if (tag.getTagNombre().equals(tagNombre)) {
					listadoPublicacionesTag.add(publicacion);
				}
			}
		}
		return assembler.toCollectionModel(listadoPublicacionesTag);
	}
	
	@GetMapping(path = "publicacionesByLugar/{provincia}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesByLugar(PersistentEntityResourceAssembler assembler,@PathVariable("provincia") String provincia) {
		
		List<Publicacion> listadoPublicaciones = publicacionDAO.findAll();
		List<Publicacion> listadoPublicacionesLugar = new ArrayList<Publicacion>();
		for (Publicacion publicacion : listadoPublicaciones) {
			if (publicacion.getProvincia().equals(provincia)) {
				listadoPublicacionesLugar.add(publicacion);
			}
		}
		return assembler.toCollectionModel(listadoPublicacionesLugar);
	}
	
}
