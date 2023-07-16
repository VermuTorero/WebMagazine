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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.peterfonkel.webMagazine.entities.Categoria;
import com.peterfonkel.webMagazine.entities.Producto;
import com.peterfonkel.webMagazine.repositories.CategoriaDAO;
import com.peterfonkel.webMagazine.services.CategoriaService;
import com.peterfonkel.webMagazine.services.ProductoService;

@RepositoryRestController
@RequestMapping(path = "/api/productos/search")
@CrossOrigin
public class ProductosController {
	
	@Autowired
	ProductoService productoService;
	
	public ProductosController(){
	}
	
	public ProductoService getProductoService() {
		return productoService;
	}

	@GetMapping(path = "productoById/{id}")
	@ResponseBody
	public PersistentEntityResource getProductoById(PersistentEntityResourceAssembler assembler,@PathVariable("id") Long id) {
		Producto producto = getProductoService().getById(id);
		return assembler.toModel(producto);
	}
	
	@GetMapping(path = "productos")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getProductos(PersistentEntityResourceAssembler assembler) {
		List<Producto> productos = getProductoService().findAll();
		return assembler.toCollectionModel(productos);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PatchMapping(path = "postProducto")
	@ResponseBody
	public PersistentEntityResource postProductoById(PersistentEntityResourceAssembler assembler, @RequestBody Producto productoNuevo) {
		Producto producto = getProductoService().save(productoNuevo);
		return assembler.toModel(producto);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PatchMapping(path = "patchProducto")
	@ResponseBody
	public PersistentEntityResource patchProductoById(PersistentEntityResourceAssembler assembler, @RequestBody Producto productoNuevo) {
		Producto producto = getProductoService().findById(productoNuevo.getId());
		producto = productoNuevo;
		getProductoService().save(producto);
		return assembler.toModel(producto);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@DeleteMapping(path = "deleteProducto/{id}")
	@ResponseBody
	public void deleteProductoById(PersistentEntityResourceAssembler assembler,@PathVariable("id") Long id) {
		getProductoService().deleteById(id);
	}
	
}
