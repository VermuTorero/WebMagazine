package com.peterfonkel.webMagazine.services;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.peterfonkel.webMagazine.entities.Publicacion;
import com.peterfonkel.webMagazine.repositories.PublicacionDAO;

@Service
@Transactional
public class PublicacionesService {
	
	@Autowired
	PublicacionDAO publicacionDAO;
	
	public List<Publicacion> findAll(){
		return publicacionDAO.findAll();
	}
	
	public Optional<Publicacion> findById(Long id) {
		return publicacionDAO.findById(id);
	}
	
	public List<Publicacion> findByLugar_LugarNombre(String lugarNombre){
		return publicacionDAO.findByLugar_LugarNombre(lugarNombre);
	}
	
	public List<Publicacion> findByTags_TagNombre(String tagNombre){
		return publicacionDAO.findByTags_TagNombre(tagNombre);
	}
	
	public List<Publicacion> findByTags_TagNombreAndIdNot(String tagNombre, Long id){
		return findByTags_TagNombreAndIdNot(tagNombre, id);
	}
	
	public List<Publicacion> findByDestacadoIsTrue(){
		return publicacionDAO.findByDestacadoIsTrue();
	}
	
	public List<Publicacion> findByCarouselIsTrue(){
		return publicacionDAO.findByCarouselIsTrue();
	}
	
	public List<Publicacion> findByCarouselIsFalse(){
		return publicacionDAO.findByCarouselIsFalse();
	}
	public	List<Publicacion> findByLugar_LugarNombreAndIdNot(String lugarNombre, Long id){
		return publicacionDAO.findByLugar_LugarNombreAndIdNot(lugarNombre, id);
	}
	
	public List<Publicacion> findByCategoria_categoriaNombre(String categoriaNombre){
		return publicacionDAO.findByCategoria_categoriaNombre(categoriaNombre);
	}
	
	public Publicacion findByTitulo(String titulo) {
		return publicacionDAO.findByTitulo(titulo);
	}
	
	public List<Publicacion> findByTituloContainingIgnoreCase(String palabra){
		return publicacionDAO.findByTituloContainingIgnoreCase(palabra);
	}
	
	public Publicacion save(Publicacion publicacion) {
		return publicacionDAO.save(publicacion);
	}
	
	public int countLikes(Long idPublicacion) {
		return findById(idPublicacion).get().getLikesRecibidos().size();
	}
	
	public void deleteById(Long id) {
		publicacionDAO.deleteById(id);
	}

	public Publicacion findByUrl(String url) {
		return publicacionDAO.findByUrl(url);
	}

}
