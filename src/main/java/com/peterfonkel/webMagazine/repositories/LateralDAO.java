package com.peterfonkel.webMagazine.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import com.peterfonkel.webMagazine.entities.Lateral;

@RepositoryRestResource(path = "laterales", itemResourceRel = "lateral", collectionResourceRel = "laterales")
public interface LateralDAO extends JpaRepository<Lateral, Long>{

	@Override
	List<Lateral> findAll();

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	<S extends Lateral> S save(S entity);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteById(Long id);
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void delete(Lateral entity);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAllById(Iterable<? extends Long> ids);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAll(Iterable<? extends Lateral> entities);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAll();

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	<S extends Lateral> List<S> saveAll(Iterable<S> entities);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void flush();

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	<S extends Lateral> S saveAndFlush(S entity);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	<S extends Lateral> List<S> saveAllAndFlush(Iterable<S> entities);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAllInBatch(Iterable<Lateral> entities);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAllByIdInBatch(Iterable<Long> ids);
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAllInBatch();
	
}
