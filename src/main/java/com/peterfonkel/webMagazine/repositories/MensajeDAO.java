package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.Like;
import com.peterfonkel.webMagazine.entities.Mensaje;

@RepositoryRestResource(path = "mensajes", itemResourceRel = "mensaje", collectionResourceRel = "mensajes", exported=false)
public interface MensajeDAO extends JpaRepository<Mensaje, Long>{
	@Override
	List<Mensaje> findAll();	

}
