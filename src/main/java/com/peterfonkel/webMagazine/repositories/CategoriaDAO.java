package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import com.peterfonkel.webMagazine.entities.Categoria;

@RepositoryRestResource(path = "categorias", itemResourceRel = "categoria", collectionResourceRel = "categorias")
public interface CategoriaDAO extends JpaRepository<Categoria, Long> {
	@Override
	List<Categoria> findAll();
	
	Categoria findByCategoriaNombre(String categoriaNombre);
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	<S extends Categoria> S save(S entity);
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteById(Long id);
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void delete(Categoria entity);
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAllById(Iterable<? extends Long> ids);
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAll(Iterable<? extends Categoria> entities);
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAll();
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	<S extends Categoria> List<S> saveAll(Iterable<S> entities);
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void flush();
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	<S extends Categoria> S saveAndFlush(S entity);
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	<S extends Categoria> List<S> saveAllAndFlush(Iterable<S> entities);
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAllInBatch(Iterable<Categoria> entities);
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAllByIdInBatch(Iterable<Long> ids);
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAllInBatch();
	
	
}
