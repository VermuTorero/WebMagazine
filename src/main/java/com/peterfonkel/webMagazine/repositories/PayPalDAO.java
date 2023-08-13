package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import com.peterfonkel.webMagazine.entities.Categoria;
import com.peterfonkel.webMagazine.entities.PayPal;

@RepositoryRestResource(path = "paypals", itemResourceRel = "paypal", collectionResourceRel = "paypals", exported=false)
public interface PayPalDAO extends JpaRepository<PayPal, Long> {
	@Override
	List<PayPal> findAll();
}
