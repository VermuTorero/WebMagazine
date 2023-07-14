package com.peterfonkel.webMagazine.rest.mixins;

import java.text.Normalizer;


import java.time.Instant;
import java.util.ArrayList;
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
import org.springframework.data.rest.webmvc.PersistentEntityResource;
import org.springframework.data.rest.webmvc.PersistentEntityResourceAssembler;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.hateoas.CollectionModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.j2objc.annotations.AutoreleasePool;
import com.peterfonkel.webMagazine.entities.Categoria;
import com.peterfonkel.webMagazine.entities.Publicacion;
import com.peterfonkel.webMagazine.entities.Tag;
import com.peterfonkel.webMagazine.login.usuarios.UsuarioDAO;
import com.peterfonkel.webMagazine.login.usuarios.UsuarioService;
import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;
import com.peterfonkel.webMagazine.repositories.CategoriaDAO;
import com.peterfonkel.webMagazine.repositories.PublicacionDAO;
import com.peterfonkel.webMagazine.repositories.TagDAO;
import com.peterfonkel.webMagazine.services.CategoriaService;
import com.peterfonkel.webMagazine.services.PublicacionesService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RepositoryRestController
@RequestMapping(path = "/api/publicaciones/search")
@CrossOrigin
public class PublicacionesController {
	
	@Autowired
	PublicacionesService publicacionesService;
	
	@Autowired
	TagDAO tagDAO;
	
	@Autowired
	UsuarioService usuarioService;
	
	@Autowired
	CategoriaService categoriaService;
	
	private final static Logger logger = LoggerFactory.getLogger(Publicacion.class);
	
	public PublicacionesController(PublicacionesService publicacionesService){
		this.publicacionesService = publicacionesService;
	}
	
	public PublicacionesService getPublicacionesService() {
		return publicacionesService;
	}

	public TagDAO getTagDAO() {
		return tagDAO;
	}

	public UsuarioService getUsuarioService() {
		return usuarioService;
	}

	


	public CategoriaService getCategoriaService() {
		return categoriaService;
	}

	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER') OR hasRole('ROLE_USER_MEMBER') OR hasRole('ROLE_USER_SUBSCRIBED')")
	@GetMapping(path = "publicacionByTitulo/{titulo}")
	@ResponseBody
	public PersistentEntityResource getPublicacionByTitulo(PersistentEntityResourceAssembler assembler,@PathVariable("titulo") String titulo) {
		Publicacion publicacion = getPublicacionesService().findByTitulo(titulo);
		return assembler.toModel(publicacion);
	}
	
	@GetMapping(path = "publicacionByTituloFree/{titulo}")
	@ResponseBody
	public PersistentEntityResource getPublicacionByTituloFree(PersistentEntityResourceAssembler assembler,@PathVariable("titulo") String titulo) {
		Publicacion publicacion = getPublicacionesService().findByTitulo(titulo);
		if (publicacion.isPremium()) {
			publicacion.setHtmlPublicacion(publicacion.getHtmlPublicacion().split("</p>")[0] + publicacion.getHtmlPublicacion().split("</p>")[1] + "<br><p><b>Para ver este contenido por completo debes estar suscrito...</b></p> ");
			
		}
		return assembler.toModel(publicacion);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER') OR hasRole('ROLE_USER_MEMBER') OR hasRole('ROLE_USER_SUBSCRIBED')")
	@GetMapping(path = "publicacionesRecientes")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesRecientes(PersistentEntityResourceAssembler assembler) {
		List<Publicacion> publicaciones = getPublicacionesService().findAll();
		publicaciones.sort(Comparator.comparing(Publicacion::getFechaPublicacion, Comparator.reverseOrder()));
		List<Publicacion> publicacionesRecientes = publicaciones.subList(0, Math.min(publicaciones.size(), 12));
		return assembler.toCollectionModel(publicacionesRecientes);
	}
	

	@GetMapping(path = "publicacionesRecientesFree")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesRecientesFree(PersistentEntityResourceAssembler assembler) {
		List<Publicacion> publicaciones= getPublicacionesService().findAll();
		Collections.sort(publicaciones, Comparator.comparing(Publicacion::getFechaPublicacion).reversed());
		List<Publicacion> publicacionesRecientes = publicaciones.subList(0, Math.min(publicaciones.size(), 12));
		for (Publicacion publicacion : publicacionesRecientes) {
			if (publicacion.isPremium()) {
				publicacion.setHtmlPublicacion(publicacion.getHtmlPublicacion().split("</p>")[0]);
			}
		}
		return assembler.toCollectionModel(publicacionesRecientes);
	}
	

	@GetMapping(path = "publicacionesDestacadas")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesDestacadas(PersistentEntityResourceAssembler assembler) {
		List<Publicacion> listadoPublicacionesDestacadas = getPublicacionesService().findByDestacadoIsTrue();
		return assembler.toCollectionModel(listadoPublicacionesDestacadas);
	}
	
	
	@GetMapping(path = "publicacionesCarousel")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesCarousel(PersistentEntityResourceAssembler assembler) {
		List<Publicacion> listadoPublicacionesCarousel = getPublicacionesService().findByCarouselIsTrue();
		return assembler.toCollectionModel(listadoPublicacionesCarousel);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Cacheable("myCache")
	@GetMapping(path = "publicacionesNoCarousel")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesNoCarousel(PersistentEntityResourceAssembler assembler) {
		List<Publicacion> listadoPublicacionesNoCarousel = getPublicacionesService().findByCarouselIsFalse();
		Collections.sort(listadoPublicacionesNoCarousel, Comparator.comparing(Publicacion::getFechaPublicacion).reversed());
		return assembler.toCollectionModel(listadoPublicacionesNoCarousel);
	}
	
	
	@GetMapping(path = "publicacionesCerca/{lugarNombre}/{idPublicacion}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesCerca(PersistentEntityResourceAssembler assembler,
			@PathVariable("lugarNombre") String lugarNombre, @PathVariable("idPublicacion") Long idPublicacion) {
		List<Publicacion>listadoPublicacionesCerca = new ArrayList<>();
		listadoPublicacionesCerca = getPublicacionesService().findByLugar_LugarNombreAndIdNot(lugarNombre,idPublicacion);
		return assembler.toCollectionModel(listadoPublicacionesCerca);
	}
	
	@GetMapping(path = "publicacionesCategoria/{categoriaNombre}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesCategoria(PersistentEntityResourceAssembler assembler,
			@PathVariable("categoriaNombre") String lugarNombre, @PathVariable("categoriaNombre") String categoriaNombre) {
		List<Publicacion>listadoPublicacionesCerca = new ArrayList<>();
		listadoPublicacionesCerca = getPublicacionesService().findByCategoria_categoriaNombre(categoriaNombre);
		return assembler.toCollectionModel(listadoPublicacionesCerca);
	}

	
	@GetMapping(path = "publicacionesRelacionadas/{idPublicacion}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesRelacionadas(PersistentEntityResourceAssembler assembler,@PathVariable("idPublicacion") Long idPublicacion) {
		Publicacion publicacionRelacionada = getPublicacionesService().findById(idPublicacion).get();
		Set<Publicacion> publicacionesCoincidentesTag = new HashSet();
		for (Tag tag : publicacionRelacionada.getTags()) {
			List<Publicacion> publicacionesTag = getPublicacionesService().findByTags_TagNombreAndIdNot(tag.getTagNombre(), idPublicacion);
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
	
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@GetMapping(path = "publicacionById/{id}")
	@ResponseBody
	public PersistentEntityResource getPublicacionById(PersistentEntityResourceAssembler assembler,@PathVariable("id") Long id) {
		Publicacion publicacion = getPublicacionesService().findById(id).get();
		return assembler.toModel(publicacion);
	}
	
	@GetMapping(path = "publicacionesByTag/{tagNombre}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesByTag(PersistentEntityResourceAssembler assembler,@PathVariable("tagNombre") String tagNombre) {
		List<Publicacion> listadoPublicacionesTag = getPublicacionesService().findByTags_TagNombre(tagNombre);
		return assembler.toCollectionModel(listadoPublicacionesTag);
	}
	
	@GetMapping(path = "publicacionesByLugar/{lugarNombre}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesByLugar(PersistentEntityResourceAssembler assembler,@PathVariable("lugarNombre") String lugarNombre) {	
		List<Publicacion> listadoPublicacionesLugar = getPublicacionesService().findByLugar_LugarNombre(lugarNombre);
		return assembler.toCollectionModel(listadoPublicacionesLugar);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@PostMapping(path = "postPublicacion")
	@ResponseBody
	public PersistentEntityResource postPublicacion(PersistentEntityResourceAssembler assembler,@RequestBody Publicacion publicacion) {	
		Usuario autor = getUsuarioService().findById(publicacion.getAutor().getId()).get();
		Categoria categoria = getCategoriaService().getById(publicacion.getCategoria().getId());
		List<Tag> tagsRecibidas = new ArrayList<>();
		for (Tag tag : publicacion.getTags()) {
			tagsRecibidas.add(tagDAO.getById(tag.getId()));
		}
		publicacion.setTags(tagsRecibidas);
		publicacion.setFechaPublicacion(Instant.now());
		getPublicacionesService().save(publicacion);
		return assembler.toModel(publicacion);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@PatchMapping(path = "patchPublicacion")
	@ResponseBody
	public PersistentEntityResource patchPublicacion(PersistentEntityResourceAssembler assembler,@RequestBody Publicacion publicacion) {	
		Usuario autor = getUsuarioService().findById(publicacion.getAutor().getId()).get();
		Categoria categoria = getCategoriaService().getById(publicacion.getCategoria().getId());
		List<Tag> tagsRecibidas = new ArrayList<>();
		for (Tag tag : publicacion.getTags()) {
			tagsRecibidas.add(tagDAO.getById(tag.getId()));
		}
		publicacion.setCategoria(categoria);
		publicacion.setTags(tagsRecibidas);
		publicacion.setAutor(autor);
		getPublicacionesService().save(publicacion);
		return assembler.toModel(publicacion);
	}
	

	@GetMapping(path = "buscar-publicaciones")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesPorPalabras(PersistentEntityResourceAssembler assembler, @RequestParam("palabrasClave") String[] palabrasClave) {
	    Set<Publicacion> publicacionesEncontradas = new HashSet<>();
	    for (String palabra : palabrasClave) {
	    	if (palabra.length()>3) {
	    		 String palabraNormalizada = Normalizer.normalize(palabra, Normalizer.Form.NFD)
	    		            .replaceAll("[^\\p{ASCII}]", "") // Eliminamos los acentos
	    		            .toLowerCase(); // Convertimos a min�sculas
	    		List<Publicacion> publicacionesPorPalabra = getPublicacionesService().findByTituloContainingIgnoreCase(palabraNormalizada);
		        publicacionesEncontradas.addAll(publicacionesPorPalabra);
			}
	    }
	    return assembler.toCollectionModel(publicacionesEncontradas);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@DeleteMapping(path = "deletePublicacion/{id}")
	@ResponseBody
	public void deletePublicacion(PersistentEntityResourceAssembler assembler,@PathVariable("id") Long id) {
		Publicacion publicacion = getPublicacionesService().findById(id).get();
		getCategoriaService().deleteById(publicacion.getId());
	}
	
	
	@GetMapping(path = "getCategoriaFromPublicacion/{id}")
	@ResponseBody
	public PersistentEntityResource getCategoriaFromPublicacion(PersistentEntityResourceAssembler assembler,@PathVariable("id") Long id) {
		Publicacion publicacion = getPublicacionesService().findById(id).get();
		return assembler.toModel(publicacion.getCategoria());
	}

	@GetMapping(path = "getTagsFromPublicacion/{id}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource>getTagsFromPublicacion(PersistentEntityResourceAssembler assembler,@PathVariable("id") Long id) {
		Publicacion publicacion = getPublicacionesService().findById(id).get();
		return assembler.toCollectionModel(publicacion.getTags());
	}
	
	@GetMapping(path = "getLugarFromPublicacion/{id}")
	@ResponseBody
	public PersistentEntityResource getLugarFromPublicacion(PersistentEntityResourceAssembler assembler,@PathVariable("id") Long id) {
		Publicacion publicacion = getPublicacionesService().findById(id).get();
		return assembler.toModel(publicacion.getLugar());
	}
	
	@GetMapping(path = "getAutorFromPublicacion/{id}")
	@ResponseBody
	public PersistentEntityResource getAutorFromPublicacion(PersistentEntityResourceAssembler assembler,@PathVariable("id") Long id) {
		Publicacion publicacion = getPublicacionesService().findById(id).get();
		Usuario autorPublico = publicacion.getAutor();
		autorPublico.setEmail("");
		autorPublico.setPassword("");
		autorPublico.setClaveRecuperacion("12345678");
		return assembler.toModel(autorPublico);
	}

}
