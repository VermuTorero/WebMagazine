package com.peterfonkel.webMagazine.services;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.peterfonkel.webMagazine.entities.Categoria;
import com.peterfonkel.webMagazine.entities.Like;
import com.peterfonkel.webMagazine.entities.Publicacion;
import com.peterfonkel.webMagazine.repositories.CategoriaDAO;
import com.peterfonkel.webMagazine.repositories.LikeDAO;
import com.peterfonkel.webMagazine.repositories.PublicacionDAO;

@Service
@Transactional
public class CategoriaService {
	
	@Autowired
	CategoriaDAO categoriaDAO;
	
	public CategoriaDAO getCategoriaDAO() {
		return categoriaDAO;
	}

	public Categoria getById(Long id) {
		return getCategoriaDAO().getById(id);
	}

	public void deleteById(Long id) {
		getCategoriaDAO().deleteById(id);
	}

	public Categoria findByCategoriaNombre(String categoriaNombre) {
		return getCategoriaDAO().findByCategoriaNombre(categoriaNombre);
	}

	public Categoria findById(Long id) {
		return getCategoriaDAO().findById(id).get();
	}

	public void save(Categoria categoria) {
		getCategoriaDAO().save(categoria);
	}

	
}
