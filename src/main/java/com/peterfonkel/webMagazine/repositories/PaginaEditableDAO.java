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

@RepositoryRestResource(path = "paginaEditables", itemResourceRel = "paginaEditable", collectionResourceRel = "paginaEditables", exported=false)
public interface PaginaEditableDAO extends JpaRepository<PaginaEditable, Long>{
	
	@Override
	List<PaginaEditable> findAll();
	
	PaginaEditable findByNombrePagina(String nombrePagina);

	<S extends PaginaEditable> S save(S entity);

	Optional<PaginaEditable> findById(Long id);

	void deleteById(Long id);

}
