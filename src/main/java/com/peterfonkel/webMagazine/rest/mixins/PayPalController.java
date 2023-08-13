package com.peterfonkel.webMagazine.rest.mixins;


import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.PersistentEntityResource;
import org.springframework.data.rest.webmvc.PersistentEntityResourceAssembler;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.hateoas.CollectionModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.peterfonkel.webMagazine.entities.Categoria;
import com.peterfonkel.webMagazine.entities.PayPal;
import com.peterfonkel.webMagazine.repositories.CategoriaDAO;
import com.peterfonkel.webMagazine.services.CategoriaService;
import com.peterfonkel.webMagazine.services.PaypalService;

@RepositoryRestController
@RequestMapping(path = "/api/paypals/search")
@CrossOrigin
public class PayPalController {
	
	@Autowired
	PaypalService paypalService;
	
	public PayPalController(){
	}
	
	public PaypalService getPaypalService() {
		return paypalService;
	}

	@GetMapping(path = "paypal")
	@ResponseBody
	public PersistentEntityResource getPaypal(PersistentEntityResourceAssembler assembler) {
		PayPal paypal = getPaypalService().getById(1L);
		return assembler.toModel(paypal);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PatchMapping(path = "patchPaypal")
	@ResponseBody
	public PersistentEntityResource patchPayPal(PersistentEntityResourceAssembler assembler, @RequestBody PayPal paypalModificado) {
		PayPal paypal = getPaypalService().getById(1L);
		paypal.setClientId(paypalModificado.getClientId());
		paypal.setPrecioVino(paypalModificado.getPrecioVino());
		return assembler.toModel(getPaypalService().save(paypal));
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping(path = "postPaypal")
	@ResponseBody
	public PersistentEntityResource postPayPal(PersistentEntityResourceAssembler assembler, @RequestBody PayPal paypalNuevo) {
		return assembler.toModel(getPaypalService().save(paypalNuevo));
	}
	
}
