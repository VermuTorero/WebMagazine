package com.peterfonkel.webMagazine.rest.mixins;

import java.time.Instant;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

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
import org.springframework.web.bind.annotation.ResponseBody;

import com.peterfonkel.webMagazine.entities.Like;
import com.peterfonkel.webMagazine.entities.Publicacion;
import com.peterfonkel.webMagazine.login.usuarios.UsuarioService;
import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;
import com.peterfonkel.webMagazine.services.LikesService;
import com.peterfonkel.webMagazine.services.PublicacionesService;


@RepositoryRestController
@RequestMapping(path = "/likes/search")
@CrossOrigin
public class LikesController {
	@Autowired
	LikesService likesService;
	
	@Autowired
	UsuarioService usuarioService;
	
	@Autowired
	PublicacionesService publicacionesService;

	public LikesService getLikesService() {
		return likesService;
	}

	public UsuarioService getUsuarioService() {
		return usuarioService;
	}

	public PublicacionesService getPublicacionesService() {
		return publicacionesService;
	}


	@PostMapping(path = "postLike/{idPublicacion}")
	@ResponseBody
	public PersistentEntityResource getCategoriaByTitulo(PersistentEntityResourceAssembler assembler,HttpServletRequest request, @PathVariable("idPublicacion") Long idPublicacion, @RequestBody Like like) {
		Usuario usuario = getUsuarioService().getUsuarioFromToken(request);
		like.setUsuario(usuario);
		like.setFechaLike(Instant.now());
		like = likesService.save(like);
		Publicacion publicacion = getPublicacionesService().findById(idPublicacion).get();
		List<Like> likes =  publicacion.getLikesRecibidos();
		likes.add(like);
		publicacion.setLikesRecibidos(likes);
		publicacionesService.save(publicacion);
		return assembler.toModel(like);
	}
	
	@GetMapping(path = "likesFromPublicacion/{idPublicacion}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getLikesFromPublicacion(PersistentEntityResourceAssembler assembler, @PathVariable("idPublicacion") Long idPublicacion) {
		Publicacion publicacion = getPublicacionesService().findById(idPublicacion).get();
		List<Like> likesPublicacion = publicacion.getLikesRecibidos();
		for (Like like : likesPublicacion) {
			like.getUsuario().setPassword("");
			like.getUsuario().setClaveRecuperacion("");
			like.getUsuario().setClaveRecuperacion("");
		}
		return assembler.toCollectionModel(likesPublicacion);
	}
}
