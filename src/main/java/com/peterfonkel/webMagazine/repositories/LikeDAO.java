package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.Like;

@RepositoryRestResource(path = "likes", itemResourceRel = "like", collectionResourceRel = "likes")
public interface LikeDAO extends JpaRepository<Like, Long>{
	@Override
	List<Like> findAll();

	@Override
	<S extends Like> S save(S entity);
	

}
