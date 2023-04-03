package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.Bloque;
import com.peterfonkel.webMagazine.entities.ImagenPublicacion;
import com.peterfonkel.webMagazine.entities.PodcastPublicacion;
import com.peterfonkel.webMagazine.entities.TextoPublicacion;
import com.peterfonkel.webMagazine.entities.VideoPublicacion;

@RepositoryRestResource(path = "podcastpublicaciones", itemResourceRel = "podcastpublicacion", collectionResourceRel = "podcastpublicaciones")
public interface PodcastPublicacionDAO extends JpaRepository<PodcastPublicacion, Long>{

	@Override
	List<PodcastPublicacion> findAll();
	
}
