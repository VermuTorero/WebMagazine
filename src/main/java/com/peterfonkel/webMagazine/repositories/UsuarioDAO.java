package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.Usuario;

@RepositoryRestResource(path = "usuarios", itemResourceRel = "usuario", collectionResourceRel = "usuarios")
public interface UsuarioDAO extends JpaRepository<Usuario, Long> {
	
	@Override
	List<Usuario> findAll();

}
