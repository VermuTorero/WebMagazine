package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.CaracteristicaSuscripcion;
import com.peterfonkel.webMagazine.entities.TipoSuscripcion;

@RepositoryRestResource(path = "caracteristicaSuscripcions", itemResourceRel = "caracteristicaSuscripcion", collectionResourceRel = "caracteristicaSuscripcions")
public interface CaracteristicasSuscripcionDAO extends JpaRepository<CaracteristicaSuscripcion, Long>{
	
	@Override
	List<CaracteristicaSuscripcion> findAll();

}
