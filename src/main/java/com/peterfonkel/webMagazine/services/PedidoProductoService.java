package com.peterfonkel.webMagazine.services;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.peterfonkel.webMagazine.entities.Categoria;
import com.peterfonkel.webMagazine.entities.Like;
import com.peterfonkel.webMagazine.entities.PedidoProducto;
import com.peterfonkel.webMagazine.entities.Publicacion;
import com.peterfonkel.webMagazine.repositories.CategoriaDAO;
import com.peterfonkel.webMagazine.repositories.LikeDAO;
import com.peterfonkel.webMagazine.repositories.PedidoProductoDAO;
import com.peterfonkel.webMagazine.repositories.PublicacionDAO;

@Service
@Transactional
public class PedidoProductoService {
	
	@Autowired
	PedidoProductoDAO pedidoProductoDAO;
	


	public PedidoProductoDAO getPedidoProductoDAO() {
		return pedidoProductoDAO;
	}

	public PedidoProducto getById(Long id) {
		return getPedidoProductoDAO().getById(id);
	}

	public void deleteById(Long id) {
		getPedidoProductoDAO().deleteById(id);
	}

	public PedidoProducto findById(Long id) {
		return getPedidoProductoDAO().findById(id).get();
	}

	public PedidoProducto save(PedidoProducto pedidoProducto) {
		return getPedidoProductoDAO().save(pedidoProducto);
	}

	public List<PedidoProducto> findAll() {
		return getPedidoProductoDAO().findAll();
	}

	
}
