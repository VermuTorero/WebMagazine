package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import com.peterfonkel.webMagazine.entities.LandingPage;

@RepositoryRestResource(path = "landingpages", itemResourceRel = "landingpage", collectionResourceRel = "landingpages")
public interface LandingPageDAO extends JpaRepository<LandingPage, Long> {
	@Override
	List<LandingPage> findAll();
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	Page<LandingPage> findAll(Pageable pageable);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	<S extends LandingPage> S save(S entity);
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteById(Long id);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void delete(LandingPage entity);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAllById(Iterable<? extends Long> ids);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAll(Iterable<? extends LandingPage> entities);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAll();

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	<S extends LandingPage> List<S> saveAll(Iterable<S> entities);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void flush();

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	<S extends LandingPage> S saveAndFlush(S entity);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	<S extends LandingPage> List<S> saveAllAndFlush(Iterable<S> entities);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAllInBatch(Iterable<LandingPage> entities);
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAllByIdInBatch(Iterable<Long> ids);

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	void deleteAllInBatch();
	
}
