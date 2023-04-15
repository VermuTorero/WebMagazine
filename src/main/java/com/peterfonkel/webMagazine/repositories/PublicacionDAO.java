package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.Publicacion;
import com.peterfonkel.webMagazine.entities.Tag;

@RepositoryRestResource(path = "publicaciones", itemResourceRel = "publicacion", collectionResourceRel = "publicaciones")
public interface PublicacionDAO extends JpaRepository<Publicacion, Long>{
	@Override
	List<Publicacion> findAll();
	List<Publicacion> findByProvincia(String provincia);
	List<Publicacion> findByTags_TagNombre(String tagNombre);
	List<Publicacion> findByDestacadoIsTrue();
	List<Publicacion> findByProvinciaAndIdNot(String provincia, Long id);
	Publicacion findByTitulo(String titulo);
	
}
