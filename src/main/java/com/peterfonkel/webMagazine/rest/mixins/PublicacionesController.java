package com.peterfonkel.webMagazine.rest.mixins;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
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
import org.springframework.web.bind.annotation.ResponseBody;

import com.peterfonkel.webMagazine.entities.Publicacion;
import com.peterfonkel.webMagazine.entities.Tag;
import com.peterfonkel.webMagazine.repositories.PublicacionDAO;
import com.peterfonkel.webMagazine.repositories.TagDAO;

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
	
	@Cacheable("myCache")
	@GetMapping(path = "publicacionByTitulo/{titulo}")
	@ResponseBody
	public PersistentEntityResource getPublicacionByTitulo(PersistentEntityResourceAssembler assembler,@PathVariable("titulo") String titulo) {
		Publicacion publicacion = publicacionDAO.findByTitulo(titulo);
		return assembler.toModel(publicacion);
	}
	
	@Cacheable("myCache")
	@GetMapping(path = "publicacionesDestacadas")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesDestacadas(PersistentEntityResourceAssembler assembler) {
		List<Publicacion> listadoPublicacionesDestacadas = publicacionDAO.findByDestacadoIsTrue();
		return assembler.toCollectionModel(listadoPublicacionesDestacadas);
	}
	
	@Cacheable("myCache")
	@PostMapping(path = "publicacionesCerca")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesCerca(PersistentEntityResourceAssembler assembler,@RequestBody Publicacion publicacionRelacionada) {
		List<Publicacion> listadoPublicacionesCerca = publicacionDAO.findByProvinciaAndIdNot(publicacionRelacionada.getProvincia(), publicacionRelacionada.getId());
		return assembler.toCollectionModel(listadoPublicacionesCerca);
	}
	
	@Cacheable("myCache")
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
	
	@Cacheable("myCache")
	@GetMapping(path = "publicacionesByTag/{tagNombre}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesByTag(PersistentEntityResourceAssembler assembler,@PathVariable("tagNombre") String tagNombre) {
		List<Publicacion> listadoPublicacionesTag = publicacionDAO.findByTags_TagNombre(tagNombre);
		return assembler.toCollectionModel(listadoPublicacionesTag);
	}
	
	@Cacheable("myCache")
	@GetMapping(path = "publicacionesByLugar/{provincia}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesByLugar(PersistentEntityResourceAssembler assembler,@PathVariable("provincia") String provincia) {	
		List<Publicacion> listadoPublicacionesLugar = publicacionDAO.findByProvincia(provincia);
		return assembler.toCollectionModel(listadoPublicacionesLugar);
	}
	
}
