package com.peterfonkel.webMagazine.login.usuarios;

import org.hibernate.engine.query.spi.sql.NativeSQLQueryCollectionReturn;
import org.slf4j.Logger;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.peterfonkel.webMagazine.login.jwt.JwtProvider;
import com.peterfonkel.webMagazine.login.roles.Rol;
import com.peterfonkel.webMagazine.login.roles.RolDAO;
import com.peterfonkel.webMagazine.login.roles.enums.RolNombre;
import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

@Service
@Transactional
public class UsuarioService {

	@Value("${jwt.secret}")
	private String secretKey;

	private final static Logger logger = LoggerFactory.getLogger(JwtProvider.class);

	@Autowired
	UsuarioDAO usuarioDAO;

	@Autowired
	RolDAO rolDAO;
	
	public UsuarioDAO getUsuarioDAO() {
		return usuarioDAO;
	}
	
	public RolDAO getRolDAO() {
		return rolDAO;
	}

	public List<Usuario> getAll(){
		return usuarioDAO.findAll();
	}
	
	public List<Usuario> getUsuarios(){
		List<Usuario> listadoUsuarios = getUsuarioDAO().findAll();
		List<Usuario> usuarios = new ArrayList<>();

	    for (Usuario usuario : listadoUsuarios) {
	        if (usuario.getRoles().iterator().next().getRolNombre().equals(RolNombre.ROLE_DELETED)) {
	            
	        }else{
	        	usuarios.add(usuario);
	        }
	    }
		return usuarios;
	}
	
	
	public List<Usuario> getAdmins(){
		return getUsuarioDAO().findByRoles_RolNombre(RolNombre.ROLE_ADMIN);
	}
	
	public List<Usuario> getMembers(){
		return getUsuarioDAO().findByRoles_RolNombre(RolNombre.ROLE_USER_MEMBER);
	}
	
	public List<Usuario> getSubscribed(){
		return getUsuarioDAO().findByRoles_RolNombre(RolNombre.ROLE_USER_SUBSCRIBED);
	}
	
	public List<Usuario> getWriters(){
		return getUsuarioDAO().findByRoles_RolNombre(RolNombre.ROLE_WRITER);
	}
	
	public Optional<Usuario> getByEmail(String email) {
		return usuarioDAO.findByEmail(email);
	}
	
	public Optional<Usuario> getById(Long id) {
		return usuarioDAO.findById(id);
	}

	public boolean existsEmail(String email) {
		return usuarioDAO.existsByEmail(email);
	}

	public Usuario save(Usuario usuario) {
		return usuarioDAO.save(usuario);
	}
	
	public Rol getRolByRolNombre(String rolNombre) {
		Rol rolEncontrado = new Rol();
		List<Rol> rolesList = rolDAO.findAll();
		for (Rol rol : rolesList) {
			if (rol.getRolNombre().toString().equals(rolNombre)) {
				rolEncontrado = rol;
			}
		}
		return rolEncontrado;
	}
	
	

	public void deleteUsuarioById(Long id) {
		usuarioDAO.deleteById(id);
	}

	public Usuario getUsuarioFromToken(HttpServletRequest request) {
		String header = request.getHeader("Authorization");
		Usuario usuario = new Usuario();
		if (header != null && header.startsWith("Bearer ")) {
			String token = header.substring(7);
			logger.info("TOKEN RECIBIDO PARA OBTENER USUARIO: " + token);
			Claims bodyToken = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
			logger.info("BODY TOKEN: " + bodyToken);
			String email = "";
			if ((String) bodyToken.get("sub") != null) {
				email = (String) bodyToken.get("sub");
			} else {
				email = (String) bodyToken.get("username");
			}

			logger.info("USERNAME: " + email);
			usuario = getByEmail(email).get();
			logger.info("USUARIO: " + usuario);
			return usuario;
		}else {
			return usuario;
		}
	}

	public Usuario findByClaveActivacion(String codigoActivacion) {
		return getUsuarioDAO().findByClaveActivacion(codigoActivacion);
		
	}



	public Iterable<? extends Object> findByRoles_RolNombreIn(Set<RolNombre> roles) {
		return getUsuarioDAO().findByRoles_RolNombreIn(roles);
	}



	public Optional<Usuario> findById(Long id) {
		return getUsuarioDAO().findById(id);
	}



	public Optional<Usuario> findByEmail(String email) {
		return getUsuarioDAO().findByEmail(email);
	}



	public Usuario findByClaveRecuperacion(String claveRecuperacion) {
		return getUsuarioDAO().findByClaveRecuperacion(claveRecuperacion);
	}
}
