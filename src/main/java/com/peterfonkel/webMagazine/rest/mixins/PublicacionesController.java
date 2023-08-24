package com.peterfonkel.webMagazine.rest.mixins;

import java.text.Normalizer;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

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
import com.peterfonkel.webMagazine.entities.Click;
import com.peterfonkel.webMagazine.entities.Like;
import com.peterfonkel.webMagazine.entities.Publicacion;
import com.peterfonkel.webMagazine.entities.Tag;
import com.peterfonkel.webMagazine.login.usuarios.UsuarioDAO;
import com.peterfonkel.webMagazine.login.usuarios.UsuarioService;
import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;
import com.peterfonkel.webMagazine.repositories.CategoriaDAO;
import com.peterfonkel.webMagazine.repositories.PublicacionDAO;
import com.peterfonkel.webMagazine.repositories.TagDAO;
import com.peterfonkel.webMagazine.services.CategoriaService;
import com.peterfonkel.webMagazine.services.ClickService;
import com.peterfonkel.webMagazine.services.LikesService;
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

	@Autowired
	LikesService likesService;
	
	@Autowired
	ClickService clickService;

	private final static Logger logger = LoggerFactory.getLogger(Publicacion.class);

	public PublicacionesController(PublicacionesService publicacionesService) {
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

	public LikesService getLikesService() {
		return likesService;
	}
	
	public ClickService getClickService() {
		return clickService;
	}

	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER') OR hasRole('ROLE_USER_MEMBER') OR hasRole('ROLE_USER_SUBSCRIBED')")
	@GetMapping(path = "publicacionByUrl/{url}")
	@ResponseBody
	public PersistentEntityResource getPublicacionByUrl(PersistentEntityResourceAssembler assembler,
			@PathVariable("url") String url) {
		Publicacion publicacion = getPublicacionesService().findByUrl(url);
		return assembler.toModel(publicacion);
	}

	@GetMapping(path = "publicacionByUrlFree/{url}")
	@ResponseBody
	public PersistentEntityResource getPublicacionByUrlFree(PersistentEntityResourceAssembler assembler,
			@PathVariable("url") String url) {
		Publicacion publicacion = getPublicacionesService().findByUrl(url);
		if (publicacion.isPremium()) {
			publicacion.setHtmlPublicacion(publicacion.getHtmlPublicacion().split("</p>")[0]
					+ publicacion.getHtmlPublicacion().split("</p>")[1]
					+ "<br><p><b>Para ver este contenido por completo debes estar suscrito...</b></p> ");
		}
		return assembler.toModel(publicacion);
	}

	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER') OR hasRole('ROLE_USER_MEMBER') OR hasRole('ROLE_USER_SUBSCRIBED')")
	@GetMapping(path = "publicacionesRecientes")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesRecientes(
			PersistentEntityResourceAssembler assembler, 
			@RequestParam(defaultValue = "0") int page, // P�gina por defecto es 0 (primera p�gina)
			@RequestParam(defaultValue = "4") int size // Tama�o por defecto es 12 (12 resultados por p�gina)
	) {
		List<Publicacion> publicaciones = getPublicacionesService().findAll();

		// Filtrar las publicaciones con isPublicado en true
		List<Publicacion> publicacionesPublicadas = publicaciones.stream().filter(Publicacion::isPublicado)
				.collect(Collectors.toList());

		// Ordenar las publicaciones por fecha de publicaci�n de manera descendente
		publicacionesPublicadas.sort(Comparator.comparing(Publicacion::getFechaPublicacion, Comparator.reverseOrder()));

		// Obtener las publicaciones correspondientes a la p�gina solicitada
		int startIndex = page * size;
		int endIndex = Math.min(startIndex + size, publicacionesPublicadas.size());
		List<Publicacion> publicacionesPagina = publicacionesPublicadas.subList(startIndex, endIndex);

		return assembler.toCollectionModel(publicacionesPagina);
	}

	@GetMapping(path = "publicacionesRecientesFree")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesRecientesFree(
			PersistentEntityResourceAssembler assembler, 
			@RequestParam(defaultValue = "0") int page, // P�gina por defecto es 0 (primera p�gina)
			@RequestParam(defaultValue = "4") int size // Tama�o por defecto es 12 (12 resultados por p�gina)
	) {
		List<Publicacion> publicaciones = getPublicacionesService().findAll();

		// Filtrar las publicaciones con isPublicado en true y isPremium en false
		List<Publicacion> publicacionesRecientesFree = publicaciones.stream()
				.filter(publicacion -> publicacion.isPublicado())
				.sorted(Comparator.comparing(Publicacion::getFechaPublicacion).reversed()).skip(page * size).limit(size)
				.peek(publicacion -> {
					if (publicacion.isPremium()) {
						// Si es premium, truncamos el htmlPublicacion para que solo tenga el primer
						// p�rrafo
						String htmlPublicacion = publicacion.getHtmlPublicacion();
						int indexOfParagraphEnd = htmlPublicacion.indexOf("</p>");
						if (indexOfParagraphEnd != -1) {
							publicacion.setHtmlPublicacion(htmlPublicacion.substring(0, indexOfParagraphEnd + 4));
						}
					}
				}).collect(Collectors.toList());

		return assembler.toCollectionModel(publicacionesRecientesFree);
	}

	//	Ver todoslos borradores de todos los escritores
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping(path = "borradores")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getBorradores(PersistentEntityResourceAssembler assembler) {
		List<Publicacion> borradores = getPublicacionesService().findByIsPublicadoFalse();
		return assembler.toCollectionModel(borradores);
	}

	//Ver los borradores propios
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@GetMapping(path = "borradores/{idUsuario}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getBorradores(PersistentEntityResourceAssembler assembler,
			@PathVariable("idUsuario") Long idUsuario, HttpServletRequest request) {
		Usuario usuario = usuarioService.getUsuarioFromToken(request);
		List<Publicacion> borradores = new ArrayList<>();
		if (usuario.getId().equals(idUsuario)) {
			borradores = getPublicacionesService().findByAutorIdAndIsPublicadoFalse(idUsuario);
		}
		// Obtener las publicaciones con publicado=false del usuario especificado por
		// idUsuario
		return assembler.toCollectionModel(borradores);
	}

	//Publicaciones marcadas como destacadas
	@GetMapping(path = "publicacionesDestacadas")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesDestacadas(
			PersistentEntityResourceAssembler assembler) {
		List<Publicacion> publicacionesDestacadas = getPublicacionesService().findByIsPublicadoTrueAndIsDestacadoTrue();
		return assembler.toCollectionModel(publicacionesDestacadas);
	}

	//Publicaciones que se muestran en el carrousel
	@GetMapping(path = "publicacionesCarousel")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesCarousel(
			PersistentEntityResourceAssembler assembler) {
		List<Publicacion> listadoPublicacionesCarousel = getPublicacionesService().findByCarouselIsTrue();
		return assembler.toCollectionModel(listadoPublicacionesCarousel);
	}

	//Publicaciones que no estan en el carrousel
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Cacheable("myCache")
	@GetMapping(path = "publicacionesNoCarousel")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesNoCarousel(
			PersistentEntityResourceAssembler assembler) {
		List<Publicacion> listadoPublicacionesNoCarousel = getPublicacionesService()
				.findByCarouselIsFalseAndIsPublicadoTrue();
		Collections.sort(listadoPublicacionesNoCarousel,
				Comparator.comparing(Publicacion::getFechaPublicacion).reversed());
		return assembler.toCollectionModel(listadoPublicacionesNoCarousel);
	}

	//Publicaciones cerca de otra publicacion
	@GetMapping(path = "publicacionesCerca/{lugarNombre}/{idPublicacion}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesCerca(PersistentEntityResourceAssembler assembler,
			@PathVariable("lugarNombre") String lugarNombre, @PathVariable("idPublicacion") Long idPublicacion) {

		int numeroPublicacionesAleatorias = 5;

		// Obtener la lista de publicaciones que cumplen con los criterios de la
		// consulta
		List<Publicacion> publicaciones = getPublicacionesService()
				.findByLugar_LugarNombreAndIdNotAndIsPublicadoTrue(lugarNombre, idPublicacion);

		// Verificar si hay menos de 5 publicaciones encontradas
		if (publicaciones.size() <= numeroPublicacionesAleatorias) {
			return assembler.toCollectionModel(publicaciones);
		}

		// Mezclar aleatoriamente las publicaciones
		Collections.shuffle(publicaciones);

		// Obtener las primeras 5 publicaciones aleatorias
		List<Publicacion> publicacionesAleatorias = publicaciones.subList(0, numeroPublicacionesAleatorias);

		return assembler.toCollectionModel(publicacionesAleatorias);
	}

	//Publicaciones por categoria con rol de suscripcion
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER') OR hasRole('ROLE_USER_MEMBER') OR hasRole('ROLE_USER_SUBSCRIBED')")
	@GetMapping(path = "publicacionesCategoria/{categoriaNombre}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesCategoria(
			PersistentEntityResourceAssembler assembler, 
			@RequestParam(defaultValue = "0") int page, // P�gina por defecto es 0 (primera p�gina)
			@RequestParam(defaultValue = "8") int size, // Tama�o por defecto es 12 (12 resultados por p�gina)
			@PathVariable("categoriaNombre") String categoriaNombre) {

		List<Publicacion> publicaciones = getPublicacionesService()
				.findByCategoria_categoriaNombreAndIsPublicadoTrue(categoriaNombre);

		if(categoriaNombre.equals("Entrevidas")) {
			size = 5;
		}
		if(categoriaNombre.equals("Patata Santa") || categoriaNombre.equals("Bares") || categoriaNombre.equals("Mercados")) {
			size = 4;
		}
		// Aplicar paginado
		List<Publicacion> publicacionesPaginadas = publicaciones.stream().skip(page * size) // Omitir los resultados de
																							// las p�ginas anteriores

				.limit(size) // Tomar solo los resultados de la p�gina actual
				.collect(Collectors.toList());

		return assembler.toCollectionModel(publicacionesPaginadas);
	}
	
	//Publicaciones por categoria sin rol de suscripcion
	@GetMapping(path = "publicacionesCategoriaFree/{categoriaNombre}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesCategoriaFree(
			PersistentEntityResourceAssembler assembler, 
			@RequestParam(defaultValue = "0") int page, // P�gina por defecto es 0 (primera p�gina)
			@RequestParam(defaultValue = "8") int size, // Tama�o por defecto es 12 (12 resultados por p�gina)
			@PathVariable("categoriaNombre") String categoriaNombre) {

		List<Publicacion> publicaciones = getPublicacionesService()
				.findByCategoria_categoriaNombreAndIsPublicadoTrue(categoriaNombre);

		if(categoriaNombre.equals("Entrevidas")) {
			size = 5;
		}
		if(categoriaNombre.equals("Patata Santa") || categoriaNombre.equals("Bares") || categoriaNombre.equals("Mercados")) {
			size = 4;
		}
		
		// Aplicar paginado
		List<Publicacion> publicacionesPaginadas = publicaciones.stream().skip(page * size) // Omitir los resultados de
																							// las p�ginas anteriores
				.limit(size) // Tomar solo los resultados de la p�gina actual
				.peek(publicacion -> {
					if (publicacion.isPremium()) {
						// Si es premium, truncamos el htmlPublicacion para que solo tenga el primer
						// p�rrafo
						String htmlPublicacion = publicacion.getHtmlPublicacion();
						int indexOfParagraphEnd = htmlPublicacion.indexOf("</p>");
						if (indexOfParagraphEnd != -1) {
							publicacion.setHtmlPublicacion(htmlPublicacion.substring(0, indexOfParagraphEnd + 4));
						}
						publicacion.setHtmlPublicacion(publicacion.getHtmlPublicacion() + "<br><p><b>Para ver este contenido por completo debes estar suscrito...</b></p> ");
				
					}
				}).collect(Collectors.toList());
		
				

		return assembler.toCollectionModel(publicacionesPaginadas);
	}

	@GetMapping(path = "publicacionesRelacionadas/{idPublicacion}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesRelacionadas(
			PersistentEntityResourceAssembler assembler, @PathVariable("idPublicacion") Long idPublicacion) {

		int maximoPublicaciones = 5;

		Publicacion publicacionRelacionada = getPublicacionesService().findById(idPublicacion).get();
		Set<Publicacion> publicacionesCoincidentesTag = new HashSet<>();
		for (Tag tag : publicacionRelacionada.getTags()) {
			List<Publicacion> publicacionesTag = getPublicacionesService()
					.findByTags_TagNombreAndIdNotAndIsPublicadoTrue(tag.getTagNombre(), idPublicacion);
			publicacionesCoincidentesTag.addAll(publicacionesTag);
		}
		this.ordenarPublicacionesPorCoincidencia(publicacionesCoincidentesTag, publicacionRelacionada);

		// Verificar si hay menos de 5 publicaciones relacionadas
		if (publicacionesCoincidentesTag.size() <= maximoPublicaciones) {
			return assembler.toCollectionModel(publicacionesCoincidentesTag);
		}

		// Mezclar aleatoriamente las publicaciones relacionadas
		List<Publicacion> publicacionesAleatorias = new ArrayList<>(publicacionesCoincidentesTag);
		Collections.shuffle(publicacionesAleatorias);

		// Obtener las primeras 5 publicaciones aleatorias
		List<Publicacion> primerasPublicacionesAleatorias = publicacionesAleatorias.subList(0, maximoPublicaciones);

		return assembler.toCollectionModel(primerasPublicacionesAleatorias);
	}

	public Set<Publicacion> ordenarPublicacionesPorCoincidencia(Set<Publicacion> conjunto,
			Publicacion publicacionEntrada) {
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
	public PersistentEntityResource getPublicacionById(PersistentEntityResourceAssembler assembler,
			@PathVariable("id") Long id) {
		Publicacion publicacion = getPublicacionesService().findById(id).get();
		return assembler.toModel(publicacion);
	}

	@GetMapping(path = "publicacionesByTag/{tagNombre}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesByTag(PersistentEntityResourceAssembler assembler,
			@RequestParam(defaultValue = "0") int page, // P�gina por defecto es 0 (primera p�gina)
			@RequestParam(defaultValue = "12") int size, // Tama�o por defecto es 12 (12 resultados por p�gina)
			@PathVariable("tagNombre") String tagNombre) {

		List<Publicacion> publicaciones = getPublicacionesService().findByTags_TagNombreAndIsPublicadoTrue(tagNombre);

		// Aplicar paginado
		List<Publicacion> publicacionesPaginadas = publicaciones.stream().skip(page * size) // Omitir los resultados de
																							// las p�ginas anteriores
				.limit(size) // Tomar solo los resultados de la p�gina actual
				.collect(Collectors.toList());

		return assembler.toCollectionModel(publicacionesPaginadas);
	}

	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER') OR hasRole('ROLE_USER_MEMBER') OR hasRole('ROLE_USER_SUBSCRIBED')")
	@GetMapping(path = "publicacionesByLugarPagina/{lugarNombre}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesByLugar(
			PersistentEntityResourceAssembler assembler, 
			@RequestParam(defaultValue = "0") int page, // P�gina por defecto es 0 (primera p�gina)
			@RequestParam(defaultValue = "12") int size, // Tama�o por defecto es 12 (12 resultados por p�gina)
			@PathVariable("lugarNombre") String lugarNombre) {

		List<Publicacion> publicaciones = getPublicacionesService()
				.findByLugar_LugarNombreAndIsPublicadoTrue(lugarNombre);

		// Aplicar paginado
		List<Publicacion> publicacionesPaginadas = publicaciones.stream().skip(page * size) // Omitir los resultados de
																							// las p�ginas anteriores
				.limit(size) // Tomar solo los resultados de la p�gina actual
				.collect(Collectors.toList());

		return assembler.toCollectionModel(publicacionesPaginadas);
	}

	@GetMapping(path = "publicacionesByLugarFreePagina/{lugarNombre}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPublicacionesByLugarFree(
			PersistentEntityResourceAssembler assembler, 
			@RequestParam(defaultValue = "0") int page, // P�gina por defecto es 0 (primera p�gina)
			@RequestParam(defaultValue = "12") int size, // Tama�o por defecto es 12 (12 resultados por p�gina)
			@PathVariable("lugarNombre") String lugarNombre) {

		List<Publicacion> publicaciones = getPublicacionesService()
				.findByLugar_LugarNombreAndIsPublicadoTrue(lugarNombre);

		// Aplicar paginado
		List<Publicacion> publicacionesPaginadas = publicaciones.stream().skip(page * size) // Omitir los resultados de
																							// las p�ginas anteriores
				.limit(size) // Tomar solo los resultados de la p�gina actual
				.peek(publicacion -> {
					if (publicacion.isPremium()) {
						// Si es premium, truncamos el htmlPublicacion para que solo tenga el primer
						// p�rrafo
						String htmlPublicacion = publicacion.getHtmlPublicacion();
						int indexOfParagraphEnd = htmlPublicacion.indexOf("</p>");
						if (indexOfParagraphEnd != -1) {
							publicacion.setHtmlPublicacion(htmlPublicacion.substring(0, indexOfParagraphEnd + 4));
						}
					}
				}).collect(Collectors.toList());

		return assembler.toCollectionModel(publicacionesPaginadas);
	}

	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@PostMapping(path = "postPublicacion")
	@ResponseBody
	public PersistentEntityResource postPublicacion(PersistentEntityResourceAssembler assembler,
			@RequestBody Publicacion publicacion) {
		Usuario autor = getUsuarioService().findById(publicacion.getAutor().getId()).get();
		logger.info("CREANDO PUBLICACION CON AUTOR ID: " + autor.getId());
		Categoria categoria = getCategoriaService().getById(publicacion.getCategoria().getId());
		logger.info("CREANDO PUBLICACION CON CATEGORIA ID: " + categoria.getId());
		List<Tag> tagsRecibidas = new ArrayList<>();
		for (Tag tag : publicacion.getTags()) {
			tagsRecibidas.add(tagDAO.getById(tag.getId()));
			logger.info("TAG: " + tag.getId());
		}
		publicacion.setTags(tagsRecibidas);
		logger.info("GUARDANDO PUBLICACION CON ID: " + publicacion);
		getPublicacionesService().save(publicacion);
		return assembler.toModel(publicacion);
	}

	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@PatchMapping(path = "patchPublicacion")
	@ResponseBody
	public PersistentEntityResource patchPublicacion(PersistentEntityResourceAssembler assembler,
			@RequestBody Publicacion publicacion) {
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
	public CollectionModel<PersistentEntityResource> getPublicacionesPorPalabras(
			PersistentEntityResourceAssembler assembler, 
			@RequestParam(defaultValue = "0") int page, // P�gina por defecto es 0 (primera p�gina)
			@RequestParam(defaultValue = "12") int size, // Tama�o por defecto es 12 (12 resultados por p�gina)
			@RequestParam("palabrasClave") String[] palabrasClave) {

		Set<String> palabrasClaveFiltradas = new HashSet<>();

		// Filtrar palabras clave para eliminar stopwords y palabras cortas
		for (String palabra : palabrasClave) {
			if (palabra.length() > 3 && !esStopword(palabra)) {
				palabrasClaveFiltradas.add(palabra);
			}
		}

		Set<Publicacion> publicacionesEncontradas = new HashSet<>();
		for (String palabra : palabrasClaveFiltradas) {
			String palabraNormalizada = Normalizer.normalize(palabra, Normalizer.Form.NFD)
					.replaceAll("[^\\p{ASCII}]", "") // Eliminamos los acentos
					.toLowerCase(); // Convertimos a min�sculas

			List<Publicacion> publicacionesPorPalabra = getPublicacionesService()
					.findByTituloContainingIgnoreCaseAndIsPublicadoTrue(palabraNormalizada);
			publicacionesEncontradas.addAll(publicacionesPorPalabra);
		}

		// Aplicar paginado
		List<Publicacion> publicacionesPaginadas = publicacionesEncontradas.stream()
				.skip(page * size) // Omitir los resultados de las p�ginas anteriores
				.limit(size) // Tomar solo los resultados de la p�gina actual
				.collect(Collectors.toList());

		return assembler.toCollectionModel(publicacionesPaginadas);
	}

	private boolean esStopword(String palabra) {
		// Implementar aquí la lógica para determinar si la palabra es una stopword
		// Por ejemplo, puedes tener una lista de stopwords predefinida y verificar si
		// la palabra está en esa lista.
		// También puedes utilizar librerías o servicios externos para realizar esta
		// verificación.
		return false;
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@DeleteMapping(path = "deletePublicacion/{id}")
	@ResponseBody
	public void deletePublicacion(PersistentEntityResourceAssembler assembler, @PathVariable("id") Long id) {
		Publicacion publicacion = getPublicacionesService().findById(id).get();
		Set<Like> likes = publicacion.getLikesRecibidos();
		Set<Like> likesNuevo = new HashSet<>();
		List<Long> ids = new ArrayList<>();
		publicacion.setLikesRecibidos(likesNuevo);
		// Quito los usuarios del like y cojo el id de cada uno
		for (Like like : likes) {
			like.setUsuario(null);
			getLikesService().save(like);
			ids.add(like.getId());
		}
		// Borro los like de la publicacion
		for (Long idLike : ids) {
			getLikesService().deleteById(id);
		}
		// Borro la publicacion
		getPublicacionesService().deleteById(id);

	}

	@GetMapping(path = "getCategoriaFromPublicacion/{id}")
	@ResponseBody
	public PersistentEntityResource getCategoriaFromPublicacion(PersistentEntityResourceAssembler assembler,
			@PathVariable("id") Long id) {
		Publicacion publicacion = getPublicacionesService().findById(id).get();
		return assembler.toModel(publicacion.getCategoria());
	}

	@GetMapping(path = "getTagsFromPublicacion/{id}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getTagsFromPublicacion(PersistentEntityResourceAssembler assembler,
			@PathVariable("id") Long id) {
		Publicacion publicacion = getPublicacionesService().findById(id).get();
		return assembler.toCollectionModel(publicacion.getTags());
	}

	@GetMapping(path = "getLugarFromPublicacion/{id}")
	@ResponseBody
	public PersistentEntityResource getLugarFromPublicacion(PersistentEntityResourceAssembler assembler,
			@PathVariable("id") Long id) {
		Publicacion publicacion = getPublicacionesService().findById(id).get();
		return assembler.toModel(publicacion.getLugar());
	}

	@GetMapping(path = "getAutorFromPublicacion/{id}")
	@ResponseBody
	public PersistentEntityResource getAutorFromPublicacion(PersistentEntityResourceAssembler assembler,
			@PathVariable("id") Long id) {
		Publicacion publicacion = getPublicacionesService().findById(id).get();
		Usuario autorPublico = publicacion.getAutor();
		autorPublico.setEmail("");
		autorPublico.setPassword("");
		autorPublico.setClaveRecuperacion("12345678");
		return assembler.toModel(autorPublico);
	}
	
	@GetMapping(path = "publicacionesPersonalizadas")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> publicacionesPersonalizadas(
	        PersistentEntityResourceAssembler assembler, HttpServletRequest request) {

	    Usuario usuario = getUsuarioService().getUsuarioFromToken(request);
	    List<Click> clicksUsuario = getClickService().findByUsuario_id(usuario.getId());

	    Map<String, Integer> tagFrequency = new HashMap<>();
	    for (Click click : clicksUsuario) {
	        for (Tag tag : click.getTagsClick()) {
	            tagFrequency.put(tag.getTagNombre(), tagFrequency.getOrDefault(tag.getTagNombre(), 0) + 1);
	        }
	    }

	    List<String> topTags = tagFrequency.entrySet().stream()
	            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
	            .map(Map.Entry::getKey)
	            .limit(2)
	            .collect(Collectors.toList());

	    Set<Publicacion> recommendedPublications = new HashSet<>(); // Usar un conjunto para evitar duplicados

	    for (String tag : topTags) {
	        List<Publicacion> publicationsWithTag = getPublicacionesService().findByTags_TagNombre(tag);
	        recommendedPublications.addAll(publicationsWithTag);
	    }

	    if (recommendedPublications.size() < 5) {
	        List<Publicacion> publicationsWithSingleTag = getPublicacionesService().findByTags_TagNombre(topTags.get(0));
	        recommendedPublications.addAll(publicationsWithSingleTag);
	    }

	    List<Publicacion> limitedPublications = new ArrayList<>(recommendedPublications); // Convertir el conjunto a lista

	    Collections.shuffle(limitedPublications);

	    int maxPublicationsToShow = Math.min(limitedPublications.size(), 5);
	    limitedPublications = limitedPublications.subList(0, maxPublicationsToShow);

	    return assembler.toCollectionModel(limitedPublications);
	}



}
