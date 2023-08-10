package com.peterfonkel.webMagazine.services;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

	public List<Publicacion> findByIsPublicadoFalse() {
		return publicacionDAO.findByPublicadoFalse();
	}

	public List<Publicacion> findByIsPublicadoTrue() {
		return publicacionDAO.findByPublicadoTrue();
	}

	public List<Publicacion> findByCarouselIsFalseAndIsPublicadoTrue() {
		return publicacionDAO.findByCarouselIsFalseAndPublicadoTrue();
	}

	public List<Publicacion> findByLugar_LugarNombreAndIdNotAndIsPublicadoTrue(String lugarNombre, Long idPublicacion) {
		return publicacionDAO.findByLugar_LugarNombreAndIdNotAndPublicadoTrue(lugarNombre, idPublicacion);
	}

	public List<Publicacion> findByCategoria_categoriaNombreAndIsPublicadoTrue(String categoriaNombre) {
		return publicacionDAO.findByCategoria_categoriaNombreAndPublicadoTrue(categoriaNombre);
	}

	public List<Publicacion> findByTags_TagNombreAndIdNotAndIsPublicadoTrue(String tagNombre, Long idPublicacion) {
		return publicacionDAO.findByTags_TagNombreAndIdNotAndPublicadoTrue(tagNombre, idPublicacion);
	}

	public List<Publicacion> findByTags_TagNombreAndIsPublicadoTrue(String tagNombre) {
		return publicacionDAO.findByTags_TagNombreAndPublicadoTrue(tagNombre);
	}

	public List<Publicacion> findByLugar_LugarNombreAndIsPublicadoTrue(String lugarNombre) {
		return publicacionDAO.findByLugar_LugarNombreAndPublicadoTrue(lugarNombre);
	}

	public List<Publicacion> findByTituloContainingIgnoreCaseAndIsPublicadoTrue(String palabraNormalizada) {
		return publicacionDAO.findByTituloContainingIgnoreCaseAndPublicadoTrue(palabraNormalizada);
	}

	public List<Publicacion> findByAutorIdAndIsPublicadoFalse(Long id) {
		return publicacionDAO.findByAutorIdAndPublicadoFalse(id);
	}

	public List<Publicacion> findByIsPublicadoTrueAndIsDestacadoTrue() {
		return publicacionDAO.findByPublicadoTrueAndDestacadoTrue();
	}





}
