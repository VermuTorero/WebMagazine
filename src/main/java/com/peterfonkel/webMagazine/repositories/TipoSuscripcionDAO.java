package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.TipoSuscripcion;

@RepositoryRestResource(path = "tipoSuscripcions", itemResourceRel = "tipoSuscripcion", collectionResourceRel = "tipoSuscripcions")
public interface TipoSuscripcionDAO extends JpaRepository<TipoSuscripcion, Long>{
	
	@Override
	List<TipoSuscripcion> findAll();

}
