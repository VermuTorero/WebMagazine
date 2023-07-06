package com.peterfonkel.webMagazine.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.Direccion;

@RepositoryRestResource(path = "direcciones", itemResourceRel = "direccion", collectionResourceRel = "direcciones")
public interface DireccionDAO extends JpaRepository<Direccion, Long>{
    
    @Override
	List<Direccion> findAll();

    Optional<Direccion> findById(Long id);
}
