package com.peterfonkel.webMagazine.repositories;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.LandingPage;
import com.peterfonkel.webMagazine.entities.Lugar;
import com.peterfonkel.webMagazine.entities.Tag;

@RepositoryRestResource(path = "landingpages", itemResourceRel = "landingpage", collectionResourceRel = "landingpages")
public interface LandingPageDAO extends JpaRepository<LandingPage, Long> {
	@Override
	List<LandingPage> findAll();
}
