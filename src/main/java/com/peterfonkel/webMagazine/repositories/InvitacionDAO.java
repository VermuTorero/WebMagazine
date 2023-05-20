package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.Invitacion;


@RepositoryRestResource(path = "invitaciones", itemResourceRel = "invitacion", collectionResourceRel = "invitaciones")
public interface InvitacionDAO extends JpaRepository<Invitacion, Long> {
	@Override
	List<Invitacion> findAll();
}
