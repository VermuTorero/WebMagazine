package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.Publicacion;

@RepositoryRestResource(path = "publicaciones", itemResourceRel = "publicacion", collectionResourceRel = "publicaciones", exported = false)
public interface PublicacionDAO extends JpaRepository<Publicacion, Long>{
	@Override
	List<Publicacion> findAll();
	List<Publicacion> findByLugar_LugarNombre(String lugarNombre);
	List<Publicacion> findByTags_TagNombre(String tagNombre);
	List<Publicacion> findByTags_TagNombreAndIdNot(String tagNombre, Long id);
	List<Publicacion> findByDestacadoIsTrue();
	List<Publicacion> findByCarouselIsTrue();
	List<Publicacion> findByCarouselIsFalse();
	List<Publicacion> findByLugar_LugarNombreAndIdNot(String lugarNombre, Long id);
	List<Publicacion> findByCategoria_categoriaNombre(String categoriaNombre);
	Publicacion findByTitulo(String titulo);
	List<Publicacion> findByTituloContainingIgnoreCase(String palabra);
	Publicacion findByUrl(String url);
	List<Publicacion> findByPublicadoFalse();
	List<Publicacion> findByPublicadoTrue();
	List<Publicacion> findByCarouselIsFalseAndPublicadoTrue();
	List<Publicacion> findByLugar_LugarNombreAndIdNotAndPublicadoTrue(String lugarNombre, Long idPublicacion);
	List<Publicacion> findByCategoria_categoriaNombreAndPublicadoTrue(String categoriaNombre);
	List<Publicacion> findByTags_TagNombreAndIdNotAndPublicadoTrue(String tagNombre, Long idPublicacion);
	List<Publicacion> findByTags_TagNombreAndPublicadoTrue(String tagNombre);
	List<Publicacion> findByLugar_LugarNombreAndPublicadoTrue(String lugarNombre);
	List<Publicacion> findByTituloContainingIgnoreCaseAndPublicadoTrue(String palabraNormalizada);
	List<Publicacion> findByAutorIdAndPublicadoFalse(Long id);
	List<Publicacion> findByPublicadoTrueAndDestacadoTrue();
	List<Publicacion> findTopNByOrderByFechaPublicacionDesc(int count);
}
