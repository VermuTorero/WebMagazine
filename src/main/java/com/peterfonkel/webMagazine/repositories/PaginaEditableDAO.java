package com.peterfonkel.webMagazine.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.PaginaEditable;

@RepositoryRestResource(path = "paginaEditables", itemResourceRel = "paginaEditable", collectionResourceRel = "paginaEditables")
public interface PaginaEditableDAO extends JpaRepository<PaginaEditable, Long>{
	@Override
	List<PaginaEditable> findAll();

}
