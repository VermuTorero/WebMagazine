package com.peterfonkel.webMagazine.login;

import java.time.Duration;

import java.time.Instant;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;

import org.mapstruct.BeanMapping;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.webmvc.PersistentEntityResource;
import org.springframework.data.rest.webmvc.PersistentEntityResourceAssembler;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.hateoas.CollectionModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.apache.http.HttpEntity;
import org.apache.http.HttpHeaders;
import org.apache.http.HttpMessage;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.peterfonkel.webMagazine.ClaseConfiguracionJava;
import com.peterfonkel.webMagazine.entities.Publicacion;
import com.peterfonkel.webMagazine.login.email.EmailSender;
import com.peterfonkel.webMagazine.login.jwt.JwtProvider;
import com.peterfonkel.webMagazine.login.roles.Rol;
import com.peterfonkel.webMagazine.login.roles.RolDAO;
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

	@Value("${correoAdmin}")
	private String correoAdmin;

	@Value("${secretPsw}")
	private String secretPsw;

	@Value("${jwt.secret}")
	private String secretKey;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	private UsuarioService usuarioService;

	@Autowired
	private RolDAO rolDAO;

	@Autowired
	private UsuarioDAO usuarioDAO;

	@Autowired
	private EmailSender emailSender;
	
	@Autowired OauthController oauthController; 

	private final static Logger logger = LoggerFactory.getLogger(JwtProvider.class);

	public PasswordEncoder getPasswordEncoder() {
		return passwordEncoder;
	}

	public RolDAO getRolDAO() {
		return rolDAO;
	}

	public UsuarioDAO getUsuarioDAO() {
		return usuarioDAO;
	}

	public String getSecretPsw() {
		return secretPsw;
	}

	public UsuarioService getUsuarioService() {
		return usuarioService;
	}

	public EmailSender getEmailSender() {
		return emailSender;
	}
	

	public OauthController getOauthController() {
		return oauthController;
	}

	@PostMapping(path = "nuevoUsuario")
	@ResponseBody
	private PersistentEntityResource saveNuevoUsuario(PersistentEntityResourceAssembler assembler,
			@RequestBody Usuario usuario) throws MessagingException {
		logger.info("Salvando nuevo Usuario pendiente de confirmar email: " + usuario);
		// Se crea una secuencia de numeros aleatorios de 8 cifras anadiendo @@%. Se
		// agregaran al password codificado para inutilizarlo
		Random random = new Random();
		int codigoDesactivado = random.nextInt(90000000) + 10000000;
		String desactivado = String.valueOf(codigoDesactivado) + "@@%";
		Usuario usuarioNuevo = new Usuario(usuario.getEmail(),
				desactivado + getPasswordEncoder().encode(usuario.getPassword()));
		usuarioNuevo.setIsConfirmadoEmail(false);
		usuarioNuevo.setNombre(usuario.getNombre());
		usuarioNuevo.setApellido1(usuario.getApellido1());
		usuarioNuevo.setApellido2(usuario.getApellido2());
		usuarioNuevo.setFechaFinSuscripcion(Instant.now());
		RolNombre rolNombre = usuario.getRoles().iterator().next().getRolNombre();
		logger.info("RolNombre : " + rolNombre);
		Rol rol = getRolDAO().findByRolNombre(rolNombre).get();
		usuarioNuevo.setRolSeleccionado(rol);
		Rol rolDefault = getRolDAO().findByRolNombre(RolNombre.ROLE_USER_NOT_REGISTERED).get();
		Set<Rol> roles = new HashSet<>();
		roles.add(rolDefault);
		usuarioNuevo.setRoles(roles);
		getUsuarioDAO().save(usuarioNuevo);
		logger.info("Usuario creado");
		enviarCorreo(usuarioNuevo);
		return assembler.toModel(usuarioNuevo);
	}

	//Enviar un correo con un link de verificacion de email
	private boolean enviarCorreo(Usuario usuario) {
		logger.info("Se va a enviar un correo a: " + usuario.getEmail());
		Random random = new Random();
		try {
			int codigoActivacion = random.nextInt(90000000) + 10000000;
			usuario.setClaveActivacion(String.valueOf(codigoActivacion));
			getUsuarioDAO().save(usuario);

			getEmailSender().sendEmail(usuario.getEmail(), "confirma la suscripcion",
					"Haz click en el siguiente enlace para verificar tu email: http://vermutoreroapp.herokuapp.com/usuarios/search/confirmarEmail/"
							+ String.valueOf(codigoActivacion));
			logger.info("Enviado un correo a: " + usuario.getEmail());
			return true;
		} catch (Exception e) {
			logger.info(e.getMessage());
			return false;
		}
	}
	
	//Endpoint para verificar el email con un codigo recibido por mail.
	@GetMapping(path = "confirmarEmail/{codigoActivacion}")
	@ResponseBody
	public String confirmarEmail(PersistentEntityResourceAssembler assembler,
			@PathVariable("codigoActivacion") String codigoActivacion) {
		Usuario usuario = getUsuarioDAO().findByClaveActivacion(codigoActivacion);
		if (usuario.getEmail() != null) {
			usuario.setIsConfirmadoEmail(true);
			// Se elimina la secuencia de numeros aleatorios que invalidaban el password
			// codificado. El usuario ya puede loggearse.
			usuario.setPassword(usuario.getPassword().split("@@%")[1]);
			usuario.setRoles(new HashSet<>());
			usuario.getRoles().add(usuario.getRolSeleccionado());
			getUsuarioDAO().save(usuario);
			return "Se ha verificado tu email en VERMUTORERO.ES.";
		} else {
			return "Ha habido un error en la verificacion de tu correo";
		}
	}
	
	//Endpoint para confirmar que se ha realizado el pago de la suscripcion y aumentar 31 dias la fecha fin de suscripcion.
	@GetMapping(path = "confirmarPago/{email}")
	@ResponseBody
	public void confirmarPago(PersistentEntityResourceAssembler assembler, @PathVariable("email") String email) {
		Usuario usuario = getUsuarioDAO().findByEmail(email).get();
		if (usuario.getEmail() != null) {
			usuario.setFechaFinSuscripcion(Instant.now().plus(Duration.ofDays(31)));
			getUsuarioDAO().save(usuario);
		}
	}
	
	//Obtener el usuario a partir de un token
	@PreAuthorize("isAuthenticated()")
	@GetMapping(path = "usuarioFromToken")
	@ResponseBody
	public PersistentEntityResource usuarioFromToken(PersistentEntityResourceAssembler assembler,
			HttpServletRequest request) {
		String header = request.getHeader("Authorization");
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
			Usuario usuario = getUsuarioService().getByEmail(email).get();
			logger.info("USUARIO: " + usuario);
			usuario.setPassword("password");
			return assembler.toModel(usuario);
		} else {
			Usuario usuarioVacio = new Usuario();
			usuarioVacio.setNombre("Usuario no encontrado");
			return assembler.toModel(usuarioVacio);
		}

	}

	//Obtener todos los usuarios
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping(path = "usuarios")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getUsuarios(PersistentEntityResourceAssembler assembler) {
		List<Usuario> listadoUsuarios = getUsuarioDAO().findAll();
		return assembler.toCollectionModel(listadoUsuarios);
	}

	//Obtener los usuarios con permiso de crear y modificar una publicacion
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping(path = "autores")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getAutores(PersistentEntityResourceAssembler assembler) {
		Set<RolNombre> roles = new HashSet<>();
		roles.add(RolNombre.ROLE_WRITER);
		roles.add(RolNombre.ROLE_ADMIN);
		return assembler.toCollectionModel(getUsuarioDAO().findByRoles_RolNombreIn(roles));
	}

	//Modificar un usuario
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PatchMapping(path = "modificarUsuario")
	@ResponseBody
	public PersistentEntityResource modificarUsuario(PersistentEntityResourceAssembler assembler,
			@RequestBody Usuario usuarioModificado) {
		Usuario usuarioAntiguo = usuarioDAO.findById(usuarioModificado.getId());
		logger.info("USUARIO ANTIGUO: " + usuarioAntiguo);
		logger.info("USUARIO PARA MODIFICAR: " + usuarioModificado);
		usuarioAntiguo.setNombre(usuarioModificado.getNombre());
		usuarioAntiguo.setApellido1(usuarioModificado.getApellido1());
		usuarioAntiguo.setApellido2(usuarioModificado.getApellido2());
		usuarioAntiguo.setEmail(usuarioModificado.getEmail());
		usuarioAntiguo.setFechaFinSuscripcion(usuarioModificado.getFechaFinSuscripcion());
		Set<Rol> roles = usuarioModificado.getRoles();
		Rol rol = roles.iterator().next();
		roles = new HashSet<>();
		roles.add(getRolDAO().findByRolNombre(rol.getRolNombre()).get());
		usuarioAntiguo.setRoles(roles);
		getUsuarioDAO().save(usuarioAntiguo);
		return assembler.toModel(usuarioAntiguo);
	}

	//Modificar los datos del usuario por si mismo con un token
	@PreAuthorize("isAuthenticated()")
	@PatchMapping(path = "renovarUsuario")
	@ResponseBody
	public PersistentEntityResource renovarUsuario(PersistentEntityResourceAssembler assembler,
			@RequestBody Usuario usuarioModificado, HttpServletRequest request) {
		//Obtener el usuario a partir del token
		String header = request.getHeader("Authorization");
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
		Usuario usuarioAntiguo = getUsuarioService().getByEmail(email).get();
		logger.info("USUARIO: " + usuarioAntiguo);
		
		logger.info("USUARIO ANTIGUO: " + usuarioAntiguo);
		
		logger.info("USUARIO PARA MODIFICAR: " + usuarioModificado);
		usuarioAntiguo.setNombre(usuarioModificado.getNombre());
		usuarioAntiguo.setApellido1(usuarioModificado.getApellido1());
		usuarioAntiguo.setApellido2(usuarioModificado.getApellido2());
		usuarioAntiguo.setEmail(usuarioModificado.getEmail());
		Set<Rol> roles = usuarioModificado.getRoles();
		Rol rol = roles.iterator().next();
		roles = new HashSet<>();
		roles.add(getRolDAO().findByRolNombre(rol.getRolNombre()).get());
		usuarioAntiguo.setRoles(roles);
		getUsuarioDAO().save(usuarioAntiguo);
		usuarioAntiguo.setPassword("password");
		return assembler.toModel(usuarioAntiguo);
	}

	//Eliminar un usuario
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@DeleteMapping(path = "eliminarUsuario/{id}")
	@ResponseBody
	public void eliminarUsuarioEntityResource(PersistentEntityResourceAssembler assembler,
			@PathVariable("id") Long id) {
		Usuario usuario = getUsuarioDAO().findById(id);
		getUsuarioDAO().delete(usuario);
	}

	//Obtener los roles a partir del id de un usuario
	@PreAuthorize("isAuthenticated()")
	@GetMapping(path = "getRolesFromUsuario/{idUsuario}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getRolesFromUser(PersistentEntityResourceAssembler assembler,
			@PathVariable("idUsuario") Long idUsuario) {
		logger.info("Recibidi id: " + idUsuario);
		Usuario usuario = getUsuarioDAO().findById(idUsuario);
		logger.info("Encontrado usuario: " + usuario);
		Set<Rol> roles = usuario.getRoles();
		logger.info("Roles del usuario: " + roles);
		return assembler.toCollectionModel(roles);
	}
	
	//Obtener los roles a partir del email del usario
	@GetMapping(path = "getRolesFromEmail/{email}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getRolesFromEmail(PersistentEntityResourceAssembler assembler,
			@PathVariable("email") String email) {
		Usuario usuario = getUsuarioDAO().findByEmail(email).get();
		Set<Rol> roles = usuario.getRoles();
		return assembler.toCollectionModel(roles);
	}

	@GetMapping(path = "isConfirmed/{email}")
	@ResponseBody
	public PersistentEntityResource getConfirmedByEmail(PersistentEntityResourceAssembler assembler,
			@PathVariable("email") String email) {
		Usuario usuario = getUsuarioDAO().findByEmail(email).get();
		System.out.println(usuario.getEmail());
		usuario.setPassword("password");
		usuario.setClaveActivacion("12345678");
		return assembler.toModel(usuario);
	}

	@GetMapping(path = "roles")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getRoles(PersistentEntityResourceAssembler assembler) {
		return assembler.toCollectionModel(getRolDAO().findAll());
	}
	
	
	@GetMapping(path="enviarCorreoOlvidoPassword/{email}")
	@ResponseBody
	public boolean enviarCorreoCambioPassword(PersistentEntityResourceAssembler assembler, @PathVariable("email") String email, HttpServletRequest request) {
		try {
			String token = getOauthController().getTokenFromRequest(request);
			String endpoint ="https://webmagazine-3758a.web.app/security/usuario-editar";
			
			CloseableHttpClient httpClient = HttpClients.createDefault();
	        HttpGet HTTPrequest = new HttpGet(endpoint);
	        ((HttpMessage) request).setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token);

			
			getEmailSender().sendEmail(email, "cambio de password",
					"Haz click en el siguiente enlace para cambiar tu password: " + HTTPrequest
							);
			return true;
		} catch (Exception e) {
			logger.info("ERROR ENVIANDO EMAIL DE CAMBIO DE PASSWORD");
			return false;
		}
		
	}
	
	@PreAuthorize("isAuthenticated()")
	@PostMapping(path="cambiarPassword")
	@ResponseBody
	public PersistentEntityResource cambiarPassword(PersistentEntityResourceAssembler assembler, @RequestBody Usuario usuarioModificado, 
			HttpServletRequest request) {
		//Obtener el usuario a partir del token
				String header = request.getHeader("Authorization");
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
				Usuario usuarioAntiguo = getUsuarioService().getByEmail(email).get();
				if(usuarioAntiguo.getEmail().equals(usuarioModificado.getEmail())) {
					usuarioAntiguo.setPassword(getPasswordEncoder().encode(usuarioModificado.getPassword()));
					getUsuarioDAO().save(usuarioAntiguo);
				}
		return assembler.toModel(usuarioModificado);
	}

}
