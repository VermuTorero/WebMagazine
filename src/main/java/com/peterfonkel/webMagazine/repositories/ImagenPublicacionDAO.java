package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.Bloque;
import com.peterfonkel.webMagazine.entities.ImagenPublicacion;
import com.peterfonkel.webMagazine.entities.TextoPublicacion;

@RepositoryRestResource(path = "imagenpublicaciones", itemResourceRel = "imagenpublicacion", collectionResourceRel = "imagenpublicaciones")
public interface ImagenPublicacionDAO extends JpaRepository<ImagenPublicacion, Long>{

	@Override
	List<ImagenPublicacion> findAll();
	
}
