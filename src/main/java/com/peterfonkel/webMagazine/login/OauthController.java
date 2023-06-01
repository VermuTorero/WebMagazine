package com.peterfonkel.webMagazine.login;

import com.peterfonkel.webMagazine.login.jwt.JwtProvider;
import com.peterfonkel.webMagazine.login.roles.RolService;
import com.peterfonkel.webMagazine.login.usuarios.UsuarioService;
import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

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
			logger.info("Ya existe el usuario: ", request.getUser());
			System.out.println(request.getUser());
			System.out.println(request.getPassword());
			try {
	            Usuario usuario = usuarioService.getByEmail(request.getUser()).get();
	            System.out.println("Encontrado usuario: " + usuario);
	            Authentication authentication = authenticationManager
	        				.authenticate(new UsernamePasswordAuthenticationToken(request.getUser(), request.getPassword()));
	            System.out.println("Usuario autenicado: " + authentication);	
	            SecurityContextHolder.getContext().setAuthentication(authentication);
	            String token = jwtProvider.generateToken(authentication);
	            	
		            // Retornar el token en la respuesta
		            return ResponseEntity.ok(new AuthenticationResponse(token));
			
	            
	        } catch (AuthenticationException e) {
	        	logger.warn("fallo al autenticar");
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	        }
		} else {
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
