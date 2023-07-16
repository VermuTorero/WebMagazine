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
	
	public LikeDAO getLikeDAO() {
		return likeDAO;
	}

	public List<Like> findAll(){
		return getLikeDAO().findAll();
	}
	
	public Like save(Like like) {
		return getLikeDAO().save(like);
	}
	
	public void deleteById(Long id) {
		likeDAO.deleteById(id);
	}
	
	
}
