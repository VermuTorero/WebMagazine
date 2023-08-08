package com.peterfonkel.webMagazine.services;


import java.time.Instant;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.peterfonkel.webMagazine.entities.Click;
import com.peterfonkel.webMagazine.repositories.ClickDAO;

@Service
@Transactional
public class ClickService {
	
	@Autowired
	ClickDAO clickDAO;
	
	public ClickDAO getClickDAO() {
		return clickDAO;
	}

	public Click getById(Long id) {
		return getClickDAO().getById(id);
	}

	public void deleteById(Long id) {
		getClickDAO().deleteById(id);
	}


	public Click findById(Long id) {
		return getClickDAO().findById(id).get();
	}

	public Click save(Click click) {
		return getClickDAO().save(click);
	}

	public List<Click> findAll() {
		return getClickDAO().findAll();
	}

	public List<Click> findByUsuario_id(Long id) {
		return getClickDAO().findByUsuario_id(id);
	}

	public List<Click> findByUsuario_idAndFechaClickGreaterThan(Long id, Instant fecha) {
		return getClickDAO().findByUsuario_idAndFechaClickGreaterThan(id, fecha);
	}

	
}
