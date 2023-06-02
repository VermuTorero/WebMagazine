package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import com.peterfonkel.webMagazine.entities.ImagenInicio;


@RepositoryRestResource(path = "imagenInicios", itemResourceRel = "imagenInicio", collectionResourceRel = "imagenInicios")
public interface ImagenInicioDAO extends JpaRepository<ImagenInicio, Long> {
	@Override
	List<ImagenInicio> findAll();

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	<S extends ImagenInicio> S save(S entity);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteById(Long id);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void delete(ImagenInicio entity);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAllById(Iterable<? extends Long> ids);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAll(Iterable<? extends ImagenInicio> entities);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAll();

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	int hashCode();
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	boolean equals(Object obj);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	Object clone() throws CloneNotSupportedException;

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	String toString();

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	void finalize() throws Throwable;

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	<S extends ImagenInicio> List<S> saveAll(Iterable<S> entities);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void flush();

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	<S extends ImagenInicio> S saveAndFlush(S entity);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	<S extends ImagenInicio> List<S> saveAllAndFlush(Iterable<S> entities);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteInBatch(Iterable<ImagenInicio> entities);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAllInBatch(Iterable<ImagenInicio> entities);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAllByIdInBatch(Iterable<Long> ids);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAllInBatch();
	
}
