package com.peterfonkel.webMagazine.services;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.peterfonkel.webMagazine.entities.Categoria;
import com.peterfonkel.webMagazine.entities.Like;
import com.peterfonkel.webMagazine.entities.PaginaEditable;
import com.peterfonkel.webMagazine.entities.Publicacion;
import com.peterfonkel.webMagazine.repositories.CategoriaDAO;
import com.peterfonkel.webMagazine.repositories.LikeDAO;
import com.peterfonkel.webMagazine.repositories.PaginaEditableDAO;
import com.peterfonkel.webMagazine.repositories.PublicacionDAO;

@Service
@Transactional
public class PaginaEditableService {
	
	@Autowired
	PaginaEditableDAO paginaEditableDAO;
	
	public PaginaEditableDAO getPaginaEditableDAO() {
		return paginaEditableDAO;
	}

	public PaginaEditable findByNombrePagina(String nombrePagina) {
		return getPaginaEditableDAO().findByNombrePagina(nombrePagina);
	}

	public PaginaEditable findById(Long id) {
		return getPaginaEditableDAO().findById(id).get();
	}

	public void save(PaginaEditable paginaEditable) {
		getPaginaEditableDAO().save(paginaEditable);
	}

	public void deleteById(Long id) {
		getPaginaEditableDAO().deleteById(id);
	}

	

	
}
