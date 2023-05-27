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
	default Page<PaginaEditable> findAll(Pageable pageable) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	default <S extends PaginaEditable> S save(S entity) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	default Optional<PaginaEditable> findById(Long id) {
		// TODO Auto-generated method stub
		return Optional.empty();
	}
	@Override
	default boolean existsById(Long id) {
		// TODO Auto-generated method stub
		return false;
	}
	@Override
	default long count() {
		// TODO Auto-generated method stub
		return 0;
	}
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	default void deleteById(Long id) {
		// TODO Auto-generated method stub
		
	}
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	default void delete(PaginaEditable entity) {
		// TODO Auto-generated method stub
		
	}
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	default void deleteAllById(Iterable<? extends Long> ids) {
		// TODO Auto-generated method stub
		
	}
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	default void deleteAll(Iterable<? extends PaginaEditable> entities) {
		// TODO Auto-generated method stub
		
	}
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	default void deleteAll() {
		// TODO Auto-generated method stub
		
	}
	@Override
	default <S extends PaginaEditable> Optional<S> findOne(Example<S> example) {
		// TODO Auto-generated method stub
		return Optional.empty();
	}
	@Override
	default <S extends PaginaEditable> Page<S> findAll(Example<S> example, Pageable pageable) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	default <S extends PaginaEditable> long count(Example<S> example) {
		// TODO Auto-generated method stub
		return 0;
	}
	@Override
	default <S extends PaginaEditable> boolean exists(Example<S> example) {
		// TODO Auto-generated method stub
		return false;
	}
	@Override
	default List<PaginaEditable> findAll(Sort sort) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	default List<PaginaEditable> findAllById(Iterable<Long> ids) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	default <S extends PaginaEditable> List<S> saveAll(Iterable<S> entities) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	default void flush() {
		// TODO Auto-generated method stub
		
	}
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	default <S extends PaginaEditable> S saveAndFlush(S entity) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	default <S extends PaginaEditable> List<S> saveAllAndFlush(Iterable<S> entities) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	default void deleteAllInBatch(Iterable<PaginaEditable> entities) {
		// TODO Auto-generated method stub
		
	}
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	default void deleteAllByIdInBatch(Iterable<Long> ids) {
		// TODO Auto-generated method stub
		
	}
	@Override
	default void deleteAllInBatch() {
		// TODO Auto-generated method stub
		
	}
	@Override
	default PaginaEditable getOne(Long id) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	default PaginaEditable getById(Long id) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	default <S extends PaginaEditable> List<S> findAll(Example<S> example) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	default <S extends PaginaEditable> List<S> findAll(Example<S> example, Sort sort) {
		// TODO Auto-generated method stub
		return null;
	}
	

}
