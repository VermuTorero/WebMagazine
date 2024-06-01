package com.peterfonkel.webMagazine.services;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.peterfonkel.webMagazine.entities.Categoria;
import com.peterfonkel.webMagazine.entities.Like;
import com.peterfonkel.webMagazine.entities.PedidoProducto;
import com.peterfonkel.webMagazine.entities.Producto;
import com.peterfonkel.webMagazine.entities.Publicacion;
import com.peterfonkel.webMagazine.repositories.CategoriaDAO;
import com.peterfonkel.webMagazine.repositories.LikeDAO;
import com.peterfonkel.webMagazine.repositories.PedidoProductoDAO;
import com.peterfonkel.webMagazine.repositories.ProductoDAO;
import com.peterfonkel.webMagazine.repositories.PublicacionDAO;

@Service
@Transactional
public class ProductoService {
	
	@Autowired
	ProductoDAO productoDAO;
	
	@Autowired
	PedidoProductoDAO pedidoProductoDAO;
	
	public ProductoDAO getProductoDAO() {
		return productoDAO;
	}
	
	public PedidoProductoDAO getPedidoProductoDAO() {
		return pedidoProductoDAO;
	}

	public Producto getById(Long id) {
		return getProductoDAO().getById(id);
	}

	public void deleteById(Long id) {
		getPedidoProductoDAO().deleteByProductoId(id);
		getProductoDAO().deleteById(id);
		
	}

	public Producto findById(Long id) {
		return getProductoDAO().findById(id).get();
	}

	public Producto save(Producto producto) {
		return getProductoDAO().save(producto);
	}

	public List<Producto> findAll() {
		return getProductoDAO().findAll();
	}

	
}
