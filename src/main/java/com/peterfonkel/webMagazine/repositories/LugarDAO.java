package com.peterfonkel.webMagazine.repositories;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import com.peterfonkel.webMagazine.entities.Lugar;
import com.peterfonkel.webMagazine.entities.Tag;

@RepositoryRestResource(path = "lugares", itemResourceRel = "lugar", collectionResourceRel = "lugares")
public interface LugarDAO extends JpaRepository<Lugar, Long> {
	@Override
	List<Lugar> findAll();

	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	<S extends Lugar> S save(S entity);
	
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	void deleteById(Long id);

	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	void delete(Lugar entity);

	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	void deleteAllById(Iterable<? extends Long> ids);

	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	void deleteAll(Iterable<? extends Lugar> entities);

	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	void deleteAll();
	
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	<S extends Lugar> List<S> saveAll(Iterable<S> entities);

	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	void flush();

	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	<S extends Lugar> S saveAndFlush(S entity);
	
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	<S extends Lugar> List<S> saveAllAndFlush(Iterable<S> entities);

	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	void deleteAllInBatch(Iterable<Lugar> entities);

	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	void deleteAllByIdInBatch(Iterable<Long> ids);
	
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	void deleteAllInBatch();
	
}
