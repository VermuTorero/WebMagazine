package com.peterfonkel.webMagazine.services;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.peterfonkel.webMagazine.entities.Categoria;
import com.peterfonkel.webMagazine.entities.Direccion;
import com.peterfonkel.webMagazine.entities.Like;
import com.peterfonkel.webMagazine.entities.Publicacion;
import com.peterfonkel.webMagazine.repositories.CategoriaDAO;
import com.peterfonkel.webMagazine.repositories.DireccionDAO;
import com.peterfonkel.webMagazine.repositories.LikeDAO;
import com.peterfonkel.webMagazine.repositories.PublicacionDAO;

@Service
@Transactional
public class DireccionService {
	
	@Autowired
	DireccionDAO direccionDAO;

	public DireccionDAO getDireccionDAO() {
		return direccionDAO;
	}

	public Direccion getById(Long id) {
		return getDireccionDAO().getById(id);
	}

	public void deleteById(Long id) {
		getDireccionDAO().deleteById(id);
	}

	public Direccion findById(Long id) {
		return getDireccionDAO().findById(id).get();
	}

	public Direccion save(Direccion direccion) {
		return getDireccionDAO().save(direccion);
	}

	public List<Direccion> findAll() {
		return getDireccionDAO().findAll();
	}

	
}
