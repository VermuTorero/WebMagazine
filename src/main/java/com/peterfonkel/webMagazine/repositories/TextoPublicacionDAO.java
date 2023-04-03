package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.Bloque;
import com.peterfonkel.webMagazine.entities.TextoPublicacion;

@RepositoryRestResource(path = "textopublicaciones", itemResourceRel = "textopublicacion", collectionResourceRel = "textopublicaciones")
public interface TextoPublicacionDAO extends JpaRepository<TextoPublicacion, Long>{

	@Override
	List<TextoPublicacion> findAll();
	
}
