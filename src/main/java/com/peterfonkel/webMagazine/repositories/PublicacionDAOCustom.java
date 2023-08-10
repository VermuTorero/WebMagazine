package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import com.peterfonkel.webMagazine.entities.Publicacion;

public interface PublicacionDAOCustom {

	List<Publicacion> findRandomPublications(int limit);

}
