package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.Bloque;

@RepositoryRestResource(path = "bloques", itemResourceRel = "bloque", collectionResourceRel = "bloques")
public interface BloqueDAO extends JpaRepository<Bloque, Long>{

	@Override
	List<Bloque> findAll();
	
}
