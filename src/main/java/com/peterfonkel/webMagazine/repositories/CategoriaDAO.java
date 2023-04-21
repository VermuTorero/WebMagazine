package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.Cafe;
import com.peterfonkel.webMagazine.entities.Categoria;

@RepositoryRestResource(path = "categorias", itemResourceRel = "categoria", collectionResourceRel = "categorias")
public interface CategoriaDAO extends JpaRepository<Categoria, Long> {
	@Override
	List<Categoria> findAll();
	Categoria findByCategoriaNombre(String categoriaNombre);
}
