package com.peterfonkel.webMagazine.repositories;

import java.util.List;

//import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.Publicacion;

@RepositoryRestResource(path = "publicaciones", itemResourceRel = "publicacion", collectionResourceRel = "publicaciones")
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
//	@Query("SELECT p FROM Publicacion p WHERE LOWER(p.titulo) LIKE LOWER(CONCAT('%', :palabra, '%')) OR LOWER(p.subtitulo) LIKE LOWER(CONCAT('%', :palabra, '%'))")
//	List<Publicacion> buscarPorPalabra(@Param("palabra") String palabra);

}
