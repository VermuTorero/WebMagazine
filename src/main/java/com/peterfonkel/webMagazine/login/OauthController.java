package com.peterfonkel.webMagazine.login;

import com.peterfonkel.webMagazine.login.jwt.JwtProvider;
import com.peterfonkel.webMagazine.login.roles.Rol;
import com.peterfonkel.webMagazine.login.roles.RolService;
import com.peterfonkel.webMagazine.login.roles.enums.RolNombre;
import com.peterfonkel.webMagazine.login.usuarios.UsuarioService;
import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.webmvc.PersistentEntityResource;
import org.springframework.data.rest.webmvc.PersistentEntityResourceAssembler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import com.peterfonkel.webMagazine.login.dto.AuthenticationRequest;
import com.peterfonkel.webMagazine.login.dto.AuthenticationResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

@RestController
@RequestMapping("/oauth")
@CrossOrigin
public class OauthController {

	@Value("${google.clientId}")
	String googleClientId;

	@Value("${secretPsw}")
	String secretPsw;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	JwtProvider jwtProvider;

	@Autowired
	UsuarioService usuarioService;

	@Autowired
	UserDetailsService userDetailsService;

	@Autowired
	RolService rolService;

	private final static Logger logger = LoggerFactory.getLogger(JwtProvider.class);

	@PostMapping("/authenticate")
	private ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
		System.out.println(usuarioService.getByEmail(request.getPassword()));
		if (usuarioService.existsEmail(request.getUser())) {
			try {
				Usuario usuario = usuarioService.getByEmail(request.getUser()).get();
				if (usuario.getIsConfirmadoEmail()) {
					Authentication authentication = authenticationManager.authenticate(
							new UsernamePasswordAuthenticationToken(request.getUser(), request.getPassword()));
					SecurityContextHolder.getContext().setAuthentication(authentication);
					String token = jwtProvider.generateToken(authentication);
					if (usuario.getFechaFinSuscripcion().compareTo(Instant.now()) > 0
							|| usuario.getRoles().iterator().next().getRolNombre().equals("ROLE_ADMIN")
							|| usuario.getRoles().iterator().next().getRolNombre().equals("ROLE_USER_REGISTERED")) {
						// Autenticacion correcta, retornar el token en la respuesta
						return ResponseEntity.ok(new AuthenticationResponse(token));
					} else {
						// Si la autenticacion es correcta pero esta caducada
						Rol rolcaducado = rolService.getByRolNombre(RolNombre.ROLE_USER_REGISTERED).get();
						Set<Rol> roles = new HashSet<>();
						roles.add(rolcaducado);
						usuario.setRoles(roles);
						usuarioService.save(usuario);
						logger.warn("Suscripcion caducada");
						return ResponseEntity.ok(new AuthenticationResponse(token));
					}
				} else {
					// Autenticacion fallida. El email existe pero no fue verificado
					logger.warn("Email no verificado");
					return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
				}
			} catch (AuthenticationException e) {
				// Contraseña incorrecta
				logger.warn("Contraseña incorrecta");
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
			}
		} else {
			// Autenticacion fallida porque no existe el email
			logger.warn("El usuario: ", request.getUser(), "usuario no válido");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}

	@GetMapping("/renovarToken")
	public ResponseEntity<?> renovarToken(HttpServletRequest request) {
		String token = getTokenFromRequest(request);

		if (token != null && jwtProvider.validateToken(token)) {
			String email = jwtProvider.getEmailFromToken(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(email);

			if (userDetails != null) {
				String nuevoToken = jwtProvider.generateTokenFromUserDetails(userDetails);
				// Devuelve el nuevo token en la respuesta
				return ResponseEntity.ok(new AuthenticationResponse(nuevoToken));
			}
		}

		// En caso de error, devuelve una respuesta de error
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	private String getTokenFromRequest(HttpServletRequest request) {
		String bearerToken = request.getHeader("Authorization");
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
			return bearerToken.substring(7); // Elimina el prefijo "Bearer " para obtener solo el token
		}
		return null;
	}
}
