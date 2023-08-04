package com.peterfonkel.webMagazine.login.roles;

import org.slf4j.Logger;


import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.peterfonkel.webMagazine.login.roles.enums.RolNombre;

import java.util.List;
import java.util.Optional;

/**
 * servicio que gestiona la obtencion y almacenamiento de roles.
 * 
 * @author jl_pu
 *
 */
@Service
@Transactional
public class RolService {

	private final static Logger logger = LoggerFactory.getLogger(RolService.class);

	@Autowired
	RolDAO rolDAO;

	public List<Rol> getAll(){
		return rolDAO.findAll();
	}
	
	public Optional<Rol> getByRolNombre(RolNombre rolNombre) {
		logger.info("Rol en service: " + rolNombre);
		return rolDAO.findByRolNombre(rolNombre);
	}

	public boolean existsRolNombre(RolNombre rolNombre) {
		return rolDAO.existsByRolNombre(rolNombre);
	}

//	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public void save(Rol rol) {
		rolDAO.save(rol);
	}

}

