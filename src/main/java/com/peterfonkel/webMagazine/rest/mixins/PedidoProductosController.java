package com.peterfonkel.webMagazine.rest.mixins;


import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.ResponseBody;

import com.peterfonkel.webMagazine.entities.Categoria;
import com.peterfonkel.webMagazine.entities.Direccion;
import com.peterfonkel.webMagazine.entities.PedidoProducto;
import com.peterfonkel.webMagazine.login.usuarios.UsuarioService;
import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;
import com.peterfonkel.webMagazine.repositories.CategoriaDAO;
import com.peterfonkel.webMagazine.services.CategoriaService;
import com.peterfonkel.webMagazine.services.DireccionService;
import com.peterfonkel.webMagazine.services.PedidoProductoService;

@RepositoryRestController
@RequestMapping(path = "/api/pedidoProductos/search")
@CrossOrigin
public class PedidoProductosController {
	
	@Autowired
	PedidoProductoService pedidoProductoService;
	

	
	public PedidoProductosController(){
	}
	
	

	public PedidoProductoService getPedidoProductoService() {
		return pedidoProductoService;
	}



//	@PreAuthorize("isAuthenticated()")
//	@GetMapping(path = "direcciones")
//	@ResponseBody
//	public CollectionModel<PersistentEntityResource> getDireccionesByUser(PersistentEntityResourceAssembler assembler, HttpServletRequest request) {
//		Usuario usuario = getUsuarioService().getUsuarioFromToken(request);
//		List<Direccion> direccionesUsuario = usuario.getDirecciones();
//		return assembler.toCollectionModel(direccionesUsuario);
//	}
//	
//	@PreAuthorize("hasRole('ROLE_ADMIN')")
//	@GetMapping(path = "direccionesAdmin/{id}")
//	@ResponseBody
//	public CollectionModel<PersistentEntityResource> getCategorias(PersistentEntityResourceAssembler assembler,@PathVariable("id") Long id) {
//		Usuario usuario = getUsuarioService().getUsuarioFromId(id);
//		return assembler.toCollectionModel(usuario.getDirecciones());
//	}
	
	@PreAuthorize("isAuthenticated()")
	@PostMapping(path = "nuevoPedidoProducto")
	@ResponseBody
	public PersistentEntityResource postPedidoProducto(PersistentEntityResourceAssembler assembler, @RequestBody PedidoProducto pedidoProducto ) {	
		return assembler.toModel(getPedidoProductoService().save(pedidoProducto));
	}
	
//	@PreAuthorize("isAuthenticated()")
//	@PatchMapping(path = "patchDireccion")
//	@ResponseBody
//	public PersistentEntityResource patchCategoriaById(PersistentEntityResourceAssembler assembler, HttpServletRequest request, @RequestBody Direccion direccionModificada) {
//		Usuario usuario = getUsuarioService().getUsuarioFromToken(request);
//		List<Direccion> direcciones = usuario.getDirecciones();
//		Direccion direccionGuardada = new Direccion();
//		for (Direccion direccion : direcciones) {
//			if (direccion.getIdDireccion().equals(direccionModificada.getIdDireccion())) {
//				direccion.setCalle(direccionModificada.getCalle());
//				direccion.setCiudad(direccionModificada.getCiudad());
//				direccion.setCodigoPostal(direccionModificada.getCodigoPostal());
//				direccion.setNumero(direccionModificada.getNumero());
//				direccion.setPiso(direccionModificada.getPiso());
//				direccion.setPuerta(direccionModificada.getPuerta());
//				getDireccionService().save(direccion);
//				direccionGuardada = direccion;
//			}
//		}
//		usuario.setDirecciones(direcciones);
//		getUsuarioService().save(usuario);
//		return assembler.toModel(getDireccionService().save(direccionGuardada));
//	}
//	
//	@PreAuthorize("isAuthenticated()")
//	@DeleteMapping(path = "deleteDireccion/{id}")
//	@ResponseBody
//	public void deleteDireccion(PersistentEntityResourceAssembler assembler, HttpServletRequest request, @PathVariable("id") Long id) {
//		Usuario usuario = getUsuarioService().getUsuarioFromToken(request);
//		List<Direccion> direcciones = usuario.getDirecciones();
//		Direccion direccionBorrar = new Direccion();
//		for (Direccion direccion : direcciones) {
//			if (direccion.getIdDireccion().equals(id)) {
//				direccionBorrar = direccion;
//			}
//		}
//		direcciones.remove(direccionBorrar);
//		usuario.setDirecciones(direcciones);
//		getUsuarioService().save(usuario);
//		getDireccionService().deleteById(direccionBorrar.getIdDireccion());
//	}
	
}
