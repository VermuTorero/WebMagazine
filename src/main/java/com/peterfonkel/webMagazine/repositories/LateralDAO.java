package com.peterfonkel.webMagazine.repositories;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import com.peterfonkel.webMagazine.entities.Lateral;

@RepositoryRestResource(path = "laterales", itemResourceRel = "lateral", collectionResourceRel = "laterales")
public interface LateralDAO extends JpaRepository<Lateral, Long>{

	@Override
	List<Lateral> findAll();
}
