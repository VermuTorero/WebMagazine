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
	@Override
	<S extends Categoria> S save(S entity);
	
	@Override
	void deleteById(Long id);

	@Override
	void delete(Categoria entity);

	@Override
	void deleteAllById(Iterable<? extends Long> ids);

	@Override
	void deleteAll(Iterable<? extends Categoria> entities);
	
	@Override
	void deleteAll();

	@Override
	<S extends Categoria> List<S> saveAll(Iterable<S> entities);

	@Override
	void flush();

	@Override
	<S extends Categoria> S saveAndFlush(S entity);

	@Override
	<S extends Categoria> List<S> saveAllAndFlush(Iterable<S> entities);

	@Override
	void deleteAllInBatch(Iterable<Categoria> entities);

	@Override
	void deleteAllByIdInBatch(Iterable<Long> ids);

	@Override
	void deleteAllInBatch();
	
	
}
