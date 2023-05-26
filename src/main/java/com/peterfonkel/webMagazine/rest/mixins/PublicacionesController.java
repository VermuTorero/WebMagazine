package com.peterfonkel.webMagazine.rest.mixins;

import java.text.Normalizer;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.metrics.StartupStep;
import org.springframework.core.metrics.StartupStep.Tags;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.webmvc.PersistentEntityResource;
import org.springframework.data.rest.webmvc.PersistentEntityResourceAssembler;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.hateoas.CollectionModel;
import org.springframework.remoting.httpinvoker.AbstractHttpInvokerRequestExecutor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.peterfonkel.webMagazine.entities.Autor;
import com.peterfonkel.webMagazine.entities.Categoria;
import com.peterfonkel.webMagazine.entities.Publicacion;
import com.peterfonkel.webMagazine.entities.Tag;
import com.peterfonkel.webMagazine.repositories.AutorDAO;
import com.peterfonkel.webMagazine.repositories.CategoriaDAO;
import com.peterfonkel.webMagazine.repositories.PublicacionDAO;
import com.peterfonkel.webMagazine.repositories.TagDAO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RepositoryRestController
@RequestMapping(path = "/publicaciones/search")
@CrossOrigin
public class PublicacionesController {
	
	@Autowired
	PublicacionDAO publicacionDAO;
	
	@Autowired
	TagDAO tagDAO;
	
	@Autowired
	AutorDAO autorDAO;
	
	@Autowired
	CategoriaDAO categoriaDAO;
	
	private final static Logger logger = LoggerFactory.getLogger(Publicacion.class);
	
	public PublicacionesController(PublicacionDAO publicacionDAO){
		this.publicacionDAO = publicacionDAO;
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_USER_MEMBER') OR hasRole('ROLE_USER_SUSCRIBED')")
	@GetMapping(path = "publicacionByTitulo/{titulo}")
	@ResponseBody
	public PersistentEntityResource getPublicacionByTitulo(PersistentEntityResourceAssembler assembler,@PathVariable("titulo") String titulo) {
		Publicacion publicacion = publicacionDAO.findByTitulo(titulo);
		return assembler.toModel(publicacion);
	}
	
	@GetMapping(path = "publicacionByTituloFree/{titulo}")
	@ResponseBody
	public PersistentEntityResource getPublicacionByTituloFree(PersistentEntityResourceAssembler assembler,@PathVariable("titulo") String titulo) {
		Publicacion publicacion = publicacionDAO.findByTitulo(titulo);
		publicacion.setHtmlPublicacion(publicacion.getHtmlPublicacion().split("</p>")[0] + "<hr><p><b>Para ver este artículo por completo debes estar suscrito a Vermú Torero</b></p> ");
		return assembler.toModel(publicacion);
	}
	

	@GetMapping(path = "publicacionesRecientes")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesRecientes(PersistentEntityResourceAssembler assembler) {
		List<Publicacion> publicaciones = publicacionDAO.findAll();
		publicaciones.sort(Comparator.comparing(Publicacion::getFechaPublicacion, Comparator.reverseOrder()));
		List<Publicacion> publicacionesRecientes = publicaciones.subList(0, Math.min(publicaciones.size(), 12));
		return assembler.toCollectionModel(publicacionesRecientes);
	}
	

	@GetMapping(path = "publicacionesRecientesFree")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesRecientesFree(PersistentEntityResourceAssembler assembler) {
		List<Publicacion> publicaciones= publicacionDAO.findAll();
		Collections.sort(publicaciones, Comparator.comparing(Publicacion::getFechaPublicacion).reversed());
		List<Publicacion> publicacionesRecientes = publicaciones.subList(0, Math.min(publicaciones.size(), 12));
		for (Publicacion publicacion : publicacionesRecientes) {
			publicacion.setHtmlPublicacion(publicacion.getHtmlPublicacion().split("</p>")[0]);
		}
		return assembler.toCollectionModel(publicacionesRecientes);
	}
	

	@GetMapping(path = "publicacionesDestacadas")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesDestacadas(PersistentEntityResourceAssembler assembler) {
		List<Publicacion> listadoPublicacionesDestacadas = publicacionDAO.findByDestacadoIsTrue();
		return assembler.toCollectionModel(listadoPublicacionesDestacadas);
	}
	
	
	@GetMapping(path = "publicacionesCarousel")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesCarousel(PersistentEntityResourceAssembler assembler) {
		List<Publicacion> listadoPublicacionesCarousel = publicacionDAO.findByCarouselIsTrue();
		return assembler.toCollectionModel(listadoPublicacionesCarousel);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Cacheable("myCache")
	@GetMapping(path = "publicacionesNoCarousel")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesNoCarousel(PersistentEntityResourceAssembler assembler) {
		List<Publicacion> listadoPublicacionesNoCarousel = publicacionDAO.findByCarouselIsFalse();
		Collections.sort(listadoPublicacionesNoCarousel, Comparator.comparing(Publicacion::getFechaPublicacion).reversed());
		return assembler.toCollectionModel(listadoPublicacionesNoCarousel);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_USER_MEMBER') OR hasRole('ROLE_USER_SUSCRIBED')")
	@GetMapping(path = "publicacionesCerca/{lugarNombre}/{idPublicacion}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesCerca(PersistentEntityResourceAssembler assembler,
			@PathVariable("lugarNombre") String lugarNombre, @PathVariable("idPublicacion") Long idPublicacion) {
		List<Publicacion>listadoPublicacionesCerca = new ArrayList<>();
		listadoPublicacionesCerca = publicacionDAO.findByLugar_LugarNombreAndIdNot(lugarNombre,idPublicacion);
		return assembler.toCollectionModel(listadoPublicacionesCerca);
	}
	
	@GetMapping(path = "publicacionesCategoria/{categoriaNombre}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesCategoria(PersistentEntityResourceAssembler assembler,
			@PathVariable("categoriaNombre") String lugarNombre, @PathVariable("categoriaNombre") String categoriaNombre) {
		List<Publicacion>listadoPublicacionesCerca = new ArrayList<>();
		listadoPublicacionesCerca = publicacionDAO.findByCategoria_categoriaNombre(categoriaNombre);
		return assembler.toCollectionModel(listadoPublicacionesCerca);
	}

	
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_USER_MEMBER') OR hasRole('ROLE_USER_SUSCRIBED')")
	@GetMapping(path = "publicacionesRelacionadas/{idPublicacion}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesRelacionadas(PersistentEntityResourceAssembler assembler,@PathVariable("idPublicacion") Long idPublicacion) {
		Publicacion publicacionRelacionada = publicacionDAO.getById(idPublicacion);
		Set<Publicacion> publicacionesCoincidentesTag = new HashSet();
		for (Tag tag : publicacionRelacionada.getTags()) {
			List<Publicacion> publicacionesTag = publicacionDAO.findByTags_TagNombreAndIdNot(tag.getTagNombre(), idPublicacion);
			publicacionesCoincidentesTag.addAll(publicacionesTag);
		}
		this.ordenarPublicacionesPorCoincidencia(publicacionesCoincidentesTag, publicacionRelacionada);
		
		return assembler.toCollectionModel(this.eliminarElementosExceptoPrimeros3(this.ordenarPublicacionesPorCoincidencia(publicacionesCoincidentesTag, publicacionRelacionada)));
		
	}
	
	public Set<Publicacion> ordenarPublicacionesPorCoincidencia(Set<Publicacion> conjunto, Publicacion publicacionEntrada) {
	    List<Tag> tagsEntrada = publicacionEntrada.getTags();
	    Comparator<Object> comparador = Comparator.comparingInt(publicacion -> {
	        int coincidencias = 0;
	        for (Tag tag : ((Publicacion) publicacion).getTags()) {
	            if (tagsEntrada.contains(tag)) {
	                coincidencias++;
	            }
	        }
	        return coincidencias;
	    }).reversed();
	    return conjunto.stream().sorted(comparador).collect(Collectors.toCollection(LinkedHashSet<Publicacion>::new));
	}

	public Set<Publicacion> eliminarElementosExceptoPrimeros3(Set<Publicacion> conjunto) {
	    Iterator<Publicacion> iterador = conjunto.iterator();
	    int contador = 0;
	    while (iterador.hasNext() && contador < 3) {
	        iterador.next();
	        contador++;
	    }
	    while (iterador.hasNext()) {
	        iterador.next();
	        iterador.remove();
	    }
	    return conjunto;
	}

		
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_USER_MEMBER') OR hasRole('ROLE_USER_SUSCRIBED')")	
	@GetMapping(path = "publicacionesByTag/{tagNombre}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesByTag(PersistentEntityResourceAssembler assembler,@PathVariable("tagNombre") String tagNombre) {
		List<Publicacion> listadoPublicacionesTag = publicacionDAO.findByTags_TagNombre(tagNombre);
		return assembler.toCollectionModel(listadoPublicacionesTag);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_USER_MEMBER') OR hasRole('ROLE_USER_SUSCRIBED')")
	@GetMapping(path = "publicacionesByLugar/{lugarNombre}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesByLugar(PersistentEntityResourceAssembler assembler,@PathVariable("lugarNombre") String lugarNombre) {	
		List<Publicacion> listadoPublicacionesLugar = publicacionDAO.findByLugar_LugarNombre(lugarNombre);
		return assembler.toCollectionModel(listadoPublicacionesLugar);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping(path = "postPublicacion")
	@ResponseBody
	public PersistentEntityResource postPublicacion(PersistentEntityResourceAssembler assembler,@RequestBody Publicacion publicacion) {	
		Autor autor = autorDAO.getById(publicacion.getAutor().getId());
		Categoria categoria = categoriaDAO.getById(publicacion.getCategoria().getId());
		List<Tag> tagsRecibidas = new ArrayList<>();
		for (Tag tag : publicacion.getTags()) {
			tagsRecibidas.add(tagDAO.getById(tag.getId()));
		}
		publicacion.setTags(tagsRecibidas);
		publicacion.setFechaPublicacion(Instant.now());
		publicacionDAO.save(publicacion);
		return assembler.toModel(publicacion);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PatchMapping(path = "patchPublicacion")
	@ResponseBody
	public PersistentEntityResource patchPublicacion(PersistentEntityResourceAssembler assembler,@RequestBody Publicacion publicacion) {	
		Autor autor = autorDAO.getById(publicacion.getAutor().getId());
		Categoria categoria = categoriaDAO.getById(publicacion.getCategoria().getId());
		List<Tag> tagsRecibidas = new ArrayList<>();
		for (Tag tag : publicacion.getTags()) {
			tagsRecibidas.add(tagDAO.getById(tag.getId()));
		}
		publicacion.setCategoria(categoria);
		publicacion.setTags(tagsRecibidas);
		publicacion.setAutor(autor);
		publicacionDAO.save(publicacion);
		return assembler.toModel(publicacion);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_USER_MEMBER') OR hasRole('ROLE_USER_SUSCRIBED')")
	@GetMapping(path = "buscar-publicaciones")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesPorPalabras(PersistentEntityResourceAssembler assembler, @RequestParam("palabrasClave") String[] palabrasClave) {
	    Set<Publicacion> publicacionesEncontradas = new HashSet<>();
	    for (String palabra : palabrasClave) {
	    	if (palabra.length()>3) {
	    		 String palabraNormalizada = Normalizer.normalize(palabra, Normalizer.Form.NFD)
	    		            .replaceAll("[^\\p{ASCII}]", "") // Eliminamos los acentos
	    		            .toLowerCase(); // Convertimos a minï¿½sculas
	    		List<Publicacion> publicacionesPorPalabra = this.publicacionDAO.findByTituloContainingIgnoreCase(palabraNormalizada);
		        publicacionesEncontradas.addAll(publicacionesPorPalabra);
			}
	    }
	    return assembler.toCollectionModel(publicacionesEncontradas);
	}

}
