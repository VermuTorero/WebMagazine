package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.Seccion;

@RepositoryRestResource(path = "secciones", itemResourceRel = "seccion", collectionResourceRel = "secciones")
public interface SeccionDAO extends JpaRepository<Seccion, Long>{
    
    @Override
	List<Seccion> findAll();
}
