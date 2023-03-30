package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.Cafe;

@RepositoryRestResource(path = "cafes", itemResourceRel = "cafe", collectionResourceRel = "cafes")
public interface CafeDAO extends JpaRepository<Cafe, Long> {
	@Override
	List<Cafe> findAll();
}
