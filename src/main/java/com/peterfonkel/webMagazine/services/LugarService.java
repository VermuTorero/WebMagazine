package com.peterfonkel.webMagazine.services;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.peterfonkel.webMagazine.entities.Like;
import com.peterfonkel.webMagazine.entities.Lugar;
import com.peterfonkel.webMagazine.entities.Publicacion;
import com.peterfonkel.webMagazine.repositories.LikeDAO;
import com.peterfonkel.webMagazine.repositories.LugarDAO;
import com.peterfonkel.webMagazine.repositories.PublicacionDAO;

@Service
@Transactional
public class LugarService {
	
	@Autowired
	LugarDAO lugarDAO;
	
	public LugarDAO getLugarDAO() {
		return lugarDAO;
	}

	public List<Lugar> findAll(){
		return getLugarDAO().findAll();
	}
	
	public Lugar save(Lugar lugar) {
		return getLugarDAO().save(lugar);
	}
	
	public void deleteById(Long id) {
		lugarDAO.deleteById(id);
	}
	
	
}
