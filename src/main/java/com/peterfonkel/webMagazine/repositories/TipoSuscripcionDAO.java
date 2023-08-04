package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import com.peterfonkel.webMagazine.entities.TipoSuscripcion;

@RepositoryRestResource(path = "tipoSuscripcions", itemResourceRel = "tipoSuscripcion", collectionResourceRel = "tipoSuscripcions")
public interface TipoSuscripcionDAO extends JpaRepository<TipoSuscripcion, Long>{
	
	@Override
	List<TipoSuscripcion> findAll();

//	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	<S extends TipoSuscripcion> S save(S entity);
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteById(Long id);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void delete(TipoSuscripcion entity);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAllById(Iterable<? extends Long> ids);
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAll(Iterable<? extends TipoSuscripcion> entities);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAll();

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	<S extends TipoSuscripcion> List<S> saveAll(Iterable<S> entities);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void flush();

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	<S extends TipoSuscripcion> S saveAndFlush(S entity);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	<S extends TipoSuscripcion> List<S> saveAllAndFlush(Iterable<S> entities);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAllInBatch(Iterable<TipoSuscripcion> entities);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAllByIdInBatch(Iterable<Long> ids);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAllInBatch();
	

}
