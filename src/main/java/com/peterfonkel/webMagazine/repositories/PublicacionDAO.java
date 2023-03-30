package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.Publicacion;

@RepositoryRestResource(path = "publicaciones", itemResourceRel = "publicacion", collectionResourceRel = "publicaciones")
public interface PublicacionDAO extends JpaRepository<Publicacion, Long>{
	@Override
	List<Publicacion> findAll();

}
