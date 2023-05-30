package com.peterfonkel.webMagazine.login;

import java.time.Instant;


import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.webmvc.PersistentEntityResource;
import org.springframework.data.rest.webmvc.PersistentEntityResourceAssembler;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.hateoas.CollectionModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.peterfonkel.webMagazine.entities.Categoria;
import com.peterfonkel.webMagazine.entities.Publicacion;
import com.peterfonkel.webMagazine.entities.Tag;
import com.peterfonkel.webMagazine.login.dto.EmailDto;
import com.peterfonkel.webMagazine.login.jwt.JwtProvider;
import com.peterfonkel.webMagazine.login.roles.Rol;
import com.peterfonkel.webMagazine.login.roles.RolDAO;
import com.peterfonkel.webMagazine.login.roles.RolService;
import com.peterfonkel.webMagazine.login.roles.enums.RolNombre;
import com.peterfonkel.webMagazine.login.usuarios.UsuarioDAO;
import com.peterfonkel.webMagazine.login.usuarios.UsuarioService;
import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;



@RepositoryRestController
@RequestMapping(path = "/usuarios/search")
@CrossOrigin
public class UsuariosController {

	@Value("${secretPsw}")
	String secretPsw;
	
	@Value("${jwt.secret}")
	String secretKey;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	UsuarioService usuarioService;

	@Autowired
	RolDAO rolDAO;
	
	@Autowired
	UsuarioDAO usuarioDAO;
	

	private final static Logger logger = LoggerFactory.getLogger(JwtProvider.class);

	public String getSecretPsw() {
		return secretPsw;
	}

	public PasswordEncoder getPasswordEncoder() {
		return passwordEncoder;
	}



	public UsuarioService getUsuarioService() {
		return usuarioService;
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping(path = "nuevoUsuario")
	private PersistentEntityResource saveNuevoUsuario(PersistentEntityResourceAssembler assembler, @RequestBody Usuario usuario) {
		logger.info("Salvando nuevo Usuario: " + usuario);
		Usuario usuarioNuevo = new Usuario(usuario.getEmail(), getPasswordEncoder().encode(usuario.getPassword()));
		Rol rol = rolDAO.findByRolNombre(usuario.getRoles().iterator().next().getRolNombre()).get();
		Set<Rol> roles = new HashSet<>();
		roles.add(rol);
		usuarioNuevo.setRoles(roles);
		usuarioDAO.save(usuarioNuevo);
		return assembler.toModel(usuarioNuevo);
	}
	

	@PostMapping(path = "usuarioFromEmail")
	@ResponseBody
	public PersistentEntityResource usuarioFromEmail(PersistentEntityResourceAssembler assembler,@RequestBody EmailDto emailDto) {	
		Usuario usuario = usuarioDAO.findByEmail(emailDto.getValue()).get();
		return assembler.toModel(usuario);
	}

	@GetMapping(path = "usuarioFromToken")
	@ResponseBody
	public PersistentEntityResource usuarioFromToken(PersistentEntityResourceAssembler assembler,HttpServletRequest request) {	
		 String header = request.getHeader("Authorization");
		 if (header != null && header.startsWith("Bearer ")) {
		      String token = header.substring(7);
		      logger.info("TOKEN RECIBIDO PARA OBTENER USUARIO: " + token);
		     Claims bodyToken =  Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
		     logger.info("BODY TOKEN: " + bodyToken);
		     String username = (String) bodyToken.get("sub");
		     logger.info("USERNAME: " + username);
		     Usuario usuario = usuarioDAO.findByEmail(username).get();
		     logger.info("USUARIO: " + usuario);
		     return assembler.toModel(usuario);
		    }else {
		    	Usuario usuarioVacio = new Usuario();
		    	usuarioVacio.setNombre("Usuario no encontrado");
		    	return assembler.toModel(usuarioVacio);
		    }
		 
		
		
	}
	
	@GetMapping(path = "usuariosPremium")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getUsuariosPremium(PersistentEntityResourceAssembler assembler) {
		List<Usuario> listadoUsuarios = usuarioDAO.findAll();
		List<Usuario> listadoUsuariosPremium = new ArrayList<Usuario>();
		for (Usuario usuario : listadoUsuarios) {
			if (usuario.getSuscripcion().equals("premium")) {
				listadoUsuariosPremium.add(usuario);
			}
		}
		return assembler.toCollectionModel(listadoUsuariosPremium);
	}
	
	@GetMapping(path = "usuariosFree")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getUsuariosFree(PersistentEntityResourceAssembler assembler) {
		List<Usuario> listadoUsuarios = usuarioDAO.findAll();
		List<Usuario> listadoUsuariosFree = new ArrayList<Usuario>();
		for (Usuario usuario : listadoUsuarios) {
			if (usuario.getSuscripcion().equals("free")) {
				listadoUsuariosFree.add(usuario);
			}
		}
		return assembler.toCollectionModel(listadoUsuariosFree);
	}

	@GetMapping(path = "autores")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getAutores(PersistentEntityResourceAssembler assembler) {
		return assembler.toCollectionModel(usuarioDAO.findAll());
//		return assembler.toCollectionModel(usuarioDAO.findByRoles_RolNombre("ROLE_ADMIN"));
	}
	
	@PatchMapping(path="modificarUsuario")
	@ResponseBody
	public PersistentEntityResource modificarUsuario(PersistentEntityResourceAssembler assembler, @RequestBody Usuario usuarioModificado) {
		Usuario usuarioAntiguo = usuarioDAO.findById(usuarioModificado.getId());
		logger.info("USUARIO ANTIGUO: " + usuarioAntiguo);
		logger.info("USUARIO PARA MODIFICAR: " + usuarioModificado);
		usuarioAntiguo.setNombre(usuarioModificado.getNombre());
		usuarioAntiguo.setApellido1(usuarioModificado.getApellido1());
		usuarioAntiguo.setApellido2(usuarioModificado.getApellido2());
		usuarioAntiguo.setEmail(usuarioModificado.getEmail());
		Set<Rol> roles = usuarioModificado.getRoles();
		Rol rol =  roles.iterator().next();
		roles = new HashSet<>();
		roles.add(rolDAO.findByRolNombre(rol.getRolNombre()).get());
		usuarioAntiguo.setRoles(roles);
		if (usuarioModificado.getPassword()!=null || usuarioModificado.getPassword() != "") {
			usuarioAntiguo.setPassword(passwordEncoder.encode(usuarioModificado.getPassword()));
		}
		
		usuarioDAO.save(usuarioAntiguo);
		return assembler.toModel(usuarioAntiguo);
	}
	
	@DeleteMapping(path="eliminarUsuario/{id}")
	@ResponseBody
	public void eliminarUsuarioEntityResource (PersistentEntityResourceAssembler assembler, @PathVariable("id") Long id) {
		Usuario usuario = usuarioDAO.findById(id);
		usuarioDAO.delete(usuario);
	}
	
	@GetMapping(path = "getRolesFromUsuario/{idUsuario}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getRolesFromUser(PersistentEntityResourceAssembler assembler, @PathVariable("idUsuario") Long idUsuario){
		 Usuario usuario = usuarioDAO.findById(idUsuario);
		 Set<Rol> roles = usuario.getRoles();
		 return assembler.toCollectionModel(roles);
	}
	
	

}
