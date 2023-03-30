package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.Autor;

@RepositoryRestResource(path = "autores", itemResourceRel = "autor", collectionResourceRel = "autores")
public interface AutorDAO extends JpaRepository<Autor, Long>{

	@Override
	List<Autor> findAll();
}
