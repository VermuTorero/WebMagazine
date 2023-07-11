package com.peterfonkel.webMagazine.services;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.peterfonkel.webMagazine.entities.Like;
import com.peterfonkel.webMagazine.entities.Publicacion;
import com.peterfonkel.webMagazine.repositories.LikeDAO;
import com.peterfonkel.webMagazine.repositories.PublicacionDAO;

@Service
@Transactional
public class LikesService {
	
	@Autowired
	LikeDAO likeDAO;
	
	public List<Like> findAll(){
		return likeDAO.findAll();
	}
	
	public Like save(Like like) {
		return likeDAO.save(like);
	}
	
	
}
