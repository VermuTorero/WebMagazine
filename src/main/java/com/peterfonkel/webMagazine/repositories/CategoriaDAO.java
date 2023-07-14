package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import com.peterfonkel.webMagazine.entities.Categoria;

@RepositoryRestResource(path = "categorias", itemResourceRel = "categoria", collectionResourceRel = "categorias", exported=false)
public interface CategoriaDAO extends JpaRepository<Categoria, Long> {
	@Override
	List<Categoria> findAll();
	
	Categoria findByCategoriaNombre(String categoriaNombre);
	<S extends Categoria> S save(S entity);
	void deleteById(Long id);
	void delete(Categoria entity);
	void deleteAllById(Iterable<? extends Long> ids);
	void deleteAll(Iterable<? extends Categoria> entities);
	void deleteAll();
	<S extends Categoria> List<S> saveAll(Iterable<S> entities);
	void flush();
	<S extends Categoria> S saveAndFlush(S entity);
	<S extends Categoria> List<S> saveAllAndFlush(Iterable<S> entities);
	void deleteAllInBatch(Iterable<Categoria> entities);
	void deleteAllByIdInBatch(Iterable<Long> ids);
	void deleteAllInBatch();
	
	
}
