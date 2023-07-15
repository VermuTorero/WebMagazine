package com.peterfonkel.webMagazine.services;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.peterfonkel.webMagazine.entities.Like;
import com.peterfonkel.webMagazine.entities.Mensaje;
import com.peterfonkel.webMagazine.entities.Publicacion;
import com.peterfonkel.webMagazine.repositories.LikeDAO;
import com.peterfonkel.webMagazine.repositories.MensajeDAO;
import com.peterfonkel.webMagazine.repositories.PublicacionDAO;

@Service
@Transactional
public class MensajesService {
	
	@Autowired
	MensajeDAO mensajeDAO;
	
	public MensajeDAO getMensajeDAO() {
		return mensajeDAO;
	}

	public List<Mensaje> findAll(){
		return getMensajeDAO().findAll();
	}
	
	public Mensaje save(Mensaje mensaje) {
		return getMensajeDAO().save(mensaje);
	}

	public void deleteById(Long id) {
		getMensajeDAO().deleteById(id);
		
	}
	
	
}
