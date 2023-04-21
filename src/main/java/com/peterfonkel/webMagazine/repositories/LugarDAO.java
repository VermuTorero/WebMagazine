package com.peterfonkel.webMagazine.repositories;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.Lugar;
import com.peterfonkel.webMagazine.entities.Tag;

@RepositoryRestResource(path = "lugares", itemResourceRel = "lugar", collectionResourceRel = "lugares")
public interface LugarDAO extends JpaRepository<Lugar, Long> {
	@Override
	List<Lugar> findAll();
}
