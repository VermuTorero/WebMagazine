package com.peterfonkel.webMagazine.rest.mixins;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.PersistentEntityResource;
import org.springframework.data.rest.webmvc.PersistentEntityResourceAssembler;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.peterfonkel.webMagazine.entities.Direccion;
import com.peterfonkel.webMagazine.login.usuarios.UsuarioDAO;
import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;
import com.peterfonkel.webMagazine.repositories.DireccionDAO;

@RepositoryRestController
@RequestMapping(path = "/direcciones/search")
@CrossOrigin
public class DireccionController {

	@Autowired
	DireccionDAO direccionDAO;

	@Autowired
	UsuarioDAO usuarioDAO;

	public DireccionDAO getDireccionDAO() {
		return direccionDAO;
	}

	public void setDireccionDAO(DireccionDAO direccionDAO) {
		this.direccionDAO = direccionDAO;
	}

	public UsuarioDAO getUsuarioDAO() {
		return usuarioDAO;
	}

	public void setUsuarioDAO(UsuarioDAO usuarioDAO) {
		this.usuarioDAO = usuarioDAO;
	}

	@PostMapping(path = "crearDireccion")
	@ResponseBody
	public PersistentEntityResource postPedido(PersistentEntityResourceAssembler assembler,
			@RequestBody Direccion direccion) {
		Usuario usuario = getUsuarioDAO().findById(direccion.getUsuario().getId()).get();
		direccion.setUsuario(usuario);
		getDireccionDAO().save(direccion);
		return assembler.toModel(direccion);
	}

}
