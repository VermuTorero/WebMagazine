package com.peterfonkel.webMagazine.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import com.peterfonkel.webMagazine.entities.PaginaEditable;

@RepositoryRestResource(path = "paginaEditables", itemResourceRel = "paginaEditable", collectionResourceRel = "paginaEditables")
public interface PaginaEditableDAO extends JpaRepository<PaginaEditable, Long>{
	@Override
	List<PaginaEditable> findAll();
	PaginaEditable findByNombrePagina(String nombrePagina);
	@Override
	Page<PaginaEditable> findAll(Pageable pageable);
	
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	<S extends PaginaEditable> S save(S entity);
	
	@Override
	Optional<PaginaEditable> findById(Long id);
	
	@Override
	boolean existsById(Long id);
	
	@Override
	long count();
	
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	void deleteById(Long id);
	
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	void delete(PaginaEditable entity);
	
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	void deleteAllById(Iterable<? extends Long> ids);
	
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	void deleteAll(Iterable<? extends PaginaEditable> entities);
	
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	void deleteAll();
	
	@Override
	<S extends PaginaEditable> Optional<S> findOne(Example<S> example);
	
	@Override
	<S extends PaginaEditable> Page<S> findAll(Example<S> example, Pageable pageable);
	
	@Override
	<S extends PaginaEditable> long count(Example<S> example);
	
	@Override
	<S extends PaginaEditable> boolean exists(Example<S> example);
	
	@Override
	List<PaginaEditable> findAll(Sort sort);
	
	@Override
	List<PaginaEditable> findAllById(Iterable<Long> ids);
	
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	<S extends PaginaEditable> List<S> saveAll(Iterable<S> entities);
	
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	void flush();
	
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	default <S extends PaginaEditable> S saveAndFlush(S entity) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	<S extends PaginaEditable> List<S> saveAllAndFlush(Iterable<S> entities);
	
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	void deleteAllInBatch(Iterable<PaginaEditable> entities);
	
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	void deleteAllByIdInBatch(Iterable<Long> ids);
	
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	void deleteAllInBatch();
	
	@Override
	PaginaEditable getOne(Long id);
	
	@Override
	PaginaEditable getById(Long id);
	
	@Override
	<S extends PaginaEditable> List<S> findAll(Example<S> example);
	
	@Override
	<S extends PaginaEditable> List<S> findAll(Example<S> example, Sort sort);
	

}
