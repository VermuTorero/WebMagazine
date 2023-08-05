package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.Producto;

@RepositoryRestResource(path = "productos", itemResourceRel = "producto", collectionResourceRel = "productos", exported=false)
public interface ProductoDAO extends JpaRepository<Producto , Long>{
    @Override
	List<Producto> findAll();
    
}

