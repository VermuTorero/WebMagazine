package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import com.peterfonkel.webMagazine.entities.Publicacion;

public class PublicacionDAOCustomImpl implements PublicacionDAOCustom {

	@PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Publicacion> findRandomPublications(int limit) {
        return entityManager.createNativeQuery("SELECT * FROM publicacion ORDER BY RANDOM() LIMIT :limit", Publicacion.class)
                .setParameter("limit", limit)
                .getResultList();
    }
	
	
}
