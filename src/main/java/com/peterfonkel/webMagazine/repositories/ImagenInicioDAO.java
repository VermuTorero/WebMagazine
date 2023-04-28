package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.Cafe;
import com.peterfonkel.webMagazine.entities.ImagenInicio;

@RepositoryRestResource(path = "imagenInicios", itemResourceRel = "imagenInicio", collectionResourceRel = "imagenInicios")
public interface ImagenInicioDAO extends JpaRepository<ImagenInicio, Long> {
	@Override
	List<ImagenInicio> findAll();
}
