package com.peterfonkel.webMagazine.repositories;

import java.time.Instant;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import com.peterfonkel.webMagazine.entities.Categoria;
import com.peterfonkel.webMagazine.entities.Click;

@RepositoryRestResource(path = "clicks", itemResourceRel = "click", collectionResourceRel = "clicks", exported=false)
public interface ClickDAO extends JpaRepository<Click, Long> {
	@Override
	List<Click> findAll();
	List<Click> findByUsuario_id(Long id);
	List<Click> findByUsuario_idAndFechaClickGreaterThan(Long id, Instant fechaClick);
	List<Click> findByFechaClickAfter(Instant fechaLimite);
	
}
