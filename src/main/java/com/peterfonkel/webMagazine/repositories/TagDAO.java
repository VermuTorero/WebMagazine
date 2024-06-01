package com.peterfonkel.webMagazine.repositories;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import com.peterfonkel.webMagazine.entities.Tag;

@RepositoryRestResource(path = "tags", itemResourceRel = "tag", collectionResourceRel = "tags")
public interface TagDAO extends JpaRepository<Tag, Long> {
	@Override
	List<Tag> findAll();

//	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	<S extends Tag> S save(S entity);

	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	void deleteById(Long id);

	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	void delete(Tag entity);

	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	void deleteAllById(Iterable<? extends Long> ids);
	
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	void deleteAll(Iterable<? extends Tag> entities);
	
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	void deleteAll();
	
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	<S extends Tag> List<S> saveAll(Iterable<S> entities);

	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	void flush();

	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	<S extends Tag> S saveAndFlush(S entity);
	
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	<S extends Tag> List<S> saveAllAndFlush(Iterable<S> entities);
	
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	void deleteAllInBatch(Iterable<Tag> entities);

	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	void deleteAllByIdInBatch(Iterable<Long> ids);

	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@Override
	void deleteAllInBatch();
	
}
