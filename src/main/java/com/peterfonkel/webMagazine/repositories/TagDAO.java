package com.peterfonkel.webMagazine.repositories;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import com.peterfonkel.webMagazine.entities.Tag;

@RepositoryRestResource(path = "tags", itemResourceRel = "tag", collectionResourceRel = "tags")
public interface TagDAO extends JpaRepository<Tag, Long> {
	@Override
	List<Tag> findAll();
}