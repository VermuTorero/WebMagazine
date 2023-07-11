package com.peterfonkel.webMagazine.login.usuarios;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.peterfonkel.webMagazine.login.jwt.JwtProvider;
import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

@Service
@Transactional
public class UsuarioService {

	@Value("${jwt.secret}")
	private String secretKey;

	private final static Logger logger = LoggerFactory.getLogger(JwtProvider.class);

	@Autowired
	UsuarioDAO usuarioDAO;

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
}
