package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.Publicacion;

@RepositoryRestResource(path = "publicaciones", itemResourceRel = "publicacion", collectionResourceRel = "publicaciones")
public interface PublicacionDAO extends JpaRepository<Publicacion, Long>{
	@Override
	List<Publicacion> findAll();
	List<Publicacion> findByLugar_LugarNombre(String lugarNombre);
	List<Publicacion> findByTags_TagNombre(String tagNombre);
	List<Publicacion> findByDestacadoIsTrue();
	List<Publicacion> findByLugar_LugarNombreAndIdNot(String lugarNombre, Long id);
	List<Publicacion> findByCategoria_categoriaNombre(String categoriaNombre);
	Publicacion findByTitulo(String titulo);

}
