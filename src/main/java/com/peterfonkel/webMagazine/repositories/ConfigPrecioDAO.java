package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.ConfigPrecio;

@RepositoryRestResource(path = "precios", itemResourceRel = "precio", collectionResourceRel = "precios")
public interface ConfigPrecioDAO extends JpaRepository<ConfigPrecio, Long>{
    
    @Override
	List<ConfigPrecio> findAll();
}
