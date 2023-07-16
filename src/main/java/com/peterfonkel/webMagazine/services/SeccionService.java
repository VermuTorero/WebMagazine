package com.peterfonkel.webMagazine.services;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.peterfonkel.webMagazine.entities.Categoria;
import com.peterfonkel.webMagazine.entities.Like;
import com.peterfonkel.webMagazine.entities.Publicacion;
import com.peterfonkel.webMagazine.entities.Seccion;
import com.peterfonkel.webMagazine.repositories.CategoriaDAO;
import com.peterfonkel.webMagazine.repositories.LikeDAO;
import com.peterfonkel.webMagazine.repositories.PublicacionDAO;
import com.peterfonkel.webMagazine.repositories.SeccionDAO;

@Service
@Transactional
public class SeccionService {
	
	@Autowired
	SeccionDAO seccionDAO;
	
	public SeccionDAO getSeccionDAO() {
		return seccionDAO;
	}

	public Seccion getById(Long id) {
		return getSeccionDAO().getById(id);
	}

	public void deleteById(Long id) {
		getSeccionDAO().deleteById(id);
	}


	public Seccion findById(Long id) {
		return getSeccionDAO().findById(id).get();
	}

	public Seccion save(Seccion seccion) {
		return getSeccionDAO().save(seccion);
	}

	public List<Seccion> findAll() {
		return getSeccionDAO().findAll();
	}

	
}
