package com.peterfonkel.webMagazine.services;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.peterfonkel.webMagazine.entities.Categoria;
import com.peterfonkel.webMagazine.entities.Like;
import com.peterfonkel.webMagazine.entities.PayPal;
import com.peterfonkel.webMagazine.entities.Publicacion;
import com.peterfonkel.webMagazine.repositories.CategoriaDAO;
import com.peterfonkel.webMagazine.repositories.LikeDAO;
import com.peterfonkel.webMagazine.repositories.PayPalDAO;
import com.peterfonkel.webMagazine.repositories.PublicacionDAO;

@Service
@Transactional
public class PaypalService {
	
	@Autowired
	PayPalDAO payPalDAO;
	
	
	public PayPalDAO getPayPalDAO() {
		return payPalDAO;
	}

	public PayPal getById(Long id) {
		return getPayPalDAO().getById(id);
	}

	public void deleteById(Long id) {
		getPayPalDAO().deleteById(id);
	}

	public PayPal findById(Long id) {
		return getPayPalDAO().findById(id).get();
	}

	public PayPal save(PayPal payPal) {
		return getPayPalDAO().save(payPal);
	}

	public List<PayPal> findAll() {
		return getPayPalDAO().findAll();
	}

	
}
