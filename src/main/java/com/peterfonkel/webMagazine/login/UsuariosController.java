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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.peterfonkel.webMagazine.login.email.EmailSender;
import com.peterfonkel.webMagazine.login.jwt.JwtProvider;
import com.peterfonkel.webMagazine.login.roles.Rol;
import com.peterfonkel.webMagazine.login.roles.RolDAO;
import com.peterfonkel.webMagazine.login.roles.RolService;
import com.peterfonkel.webMagazine.login.roles.enums.RolNombre;
import com.peterfonkel.webMagazine.login.usuarios.UsuarioDAO;
import com.peterfonkel.webMagazine.login.usuarios.UsuarioService;
import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;
import com.peterfonkel.webMagazine.services.MensajesService;

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
	AuthenticationManager authenticationManager;

	@Autowired
	private UsuarioService usuarioService;
	
	@Autowired
	private RolService rolService;
	
	@Autowired
	private MensajesService mensajesService;

	public MensajesService getMensajesService() {
		return mensajesService;
	}

	@Autowired
	private EmailSender emailSender;

	@Autowired
	OauthController oauthController;

	@Autowired
	UserDetailsService userDetailsService;

	@Autowired
	JwtProvider jwtProvider;

	private final static Logger logger = LoggerFactory.getLogger(JwtProvider.class);

	public PasswordEncoder getPasswordEncoder() {
		return passwordEncoder;
	}
	
	public RolService getRolService() {
		return rolService;
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

	public AuthenticationManager getAuthenticationManager() {
		return authenticationManager;
	}

	public UserDetailsService getUserDetailsService() {
		return userDetailsService;
	}

	public JwtProvider getJwtProvider() {
		return jwtProvider;
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
		Rol rol = getRolService().getByRolNombre(rolNombre).get();
		usuarioNuevo.setRolSeleccionado(rol);
		Rol rolDefault = getRolService().getByRolNombre(RolNombre.ROLE_USER_NOT_REGISTERED).get();
		Set<Rol> roles = new HashSet<>();
		roles.add(rolDefault);
		usuarioNuevo.setRoles(roles);
		getUsuarioService().save(usuarioNuevo);
		logger.info("Usuario creado");
		enviarCorreo(usuarioNuevo);
		return assembler.toModel(usuarioNuevo);
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping(path = "nuevoUsuarioAdmin")
	@ResponseBody
	private PersistentEntityResource saveNuevoUsuarioAdmin(PersistentEntityResourceAssembler assembler,
			@RequestBody Usuario usuario) throws MessagingException {
		logger.info("Salvando nuevo Usuario creado por admin: " + usuario);
		// Se crea una secuencia de numeros aleatorios de 8 cifras anadiendo @@%. Se
		// agregaran al password codificado para inutilizarlo
		Random random = new Random();
		Usuario usuarioNuevo = new Usuario(usuario.getEmail(), getPasswordEncoder().encode(usuario.getPassword()));
		usuarioNuevo.setIsConfirmadoEmail(true);
		usuarioNuevo.setNombre(usuario.getNombre());
		usuarioNuevo.setApellido1(usuario.getApellido1());
		usuarioNuevo.setApellido2(usuario.getApellido2());
		usuarioNuevo.setFechaFinSuscripcion(Instant.now().plus(Duration.ofDays(31)));
		RolNombre rolNombre = usuario.getRoles().iterator().next().getRolNombre();
		logger.info("RolNombre : " + rolNombre);
		Rol rol = getRolService().getByRolNombre(rolNombre).get();
		usuarioNuevo.setRolSeleccionado(rol);
		Set<Rol> roles = new HashSet<>();
		roles.add(rol);
		usuarioNuevo.setRoles(roles);
		getUsuarioService().save(usuarioNuevo);
		logger.info("Usuario creado por admin: " + usuarioNuevo.getEmail());
		return assembler.toModel(usuarioNuevo);
	}

	// Enviar un correo con un link de verificacion de email
	private boolean enviarCorreo(Usuario usuario) {
		logger.info("Se va a enviar un correo a: " + usuario.getEmail());
		Random random = new Random();
		try {
			int codigoActivacion = random.nextInt(90000000) + 10000000;
			usuario.setClaveActivacion(String.valueOf(codigoActivacion));
			getUsuarioService().save(usuario);

			getEmailSender().sendEmail(usuario.getEmail(), "confirma la suscripcion",
					"Haz click en el siguiente enlace para verificar tu email: http://vermutoreroapp.herokuapp.com/usuarios/search/confirmarEmail/" + String.valueOf(codigoActivacion) 
							+ "\r\n"
							+ "\r\n"
							+ "\"Al registrarte en nuestra aplicación, debes aceptar los siguientes términos y condiciones:\r\n"
							+ "\r\n"
							+ "Términos y condiciones de uso: Aceptas cumplir con los términos y condiciones establecidos para el uso de nuestra aplicación. Esto incluye el compromiso de utilizar la aplicación de manera ética y respetar los derechos de propiedad intelectual.\r\n"
							+ "\r\n"
							+ "Política de privacidad: Reconoces y aceptas nuestra política de privacidad, que describe cómo recopilamos, utilizamos, almacenamos y protegemos tu información personal. Esta información incluye tu nombre y correo electrónico, que utilizamos para proporcionarte acceso a la aplicación y comunicarnos contigo de manera efectiva.\r\n"
							+ "\r\n"
							+ "Consentimiento para el procesamiento de datos: Al registrarte, otorgas tu consentimiento para que procesemos tus datos personales de acuerdo con nuestra política de privacidad. Esto implica que almacenaremos y utilizaremos tu información personal para los fines establecidos en nuestra política de privacidad.\r\n"
							+ "\r\n"
							+ "Comunicaciones adicionales: Si optas por recibir comunicaciones adicionales, como boletines informativos o promociones, nos das permiso para enviártelas a la dirección de correo electrónico proporcionada. Si en algún momento deseas dejar de recibir estas comunicaciones, podrás darte de baja siguiendo las instrucciones proporcionadas en cada mensaje.\r\n"
							+ "\r\n"
							+ "Al hacer clic en el botón de registro, confirmas que has leído y aceptado los términos y condiciones, así como nuestra política de privacidad. Asimismo, garantizas que proporcionas información veraz y te comprometes a utilizar la aplicación de manera responsable.\r\n"
							+ "\r\n"
							+ "Si tienes alguna pregunta o inquietud sobre nuestros términos y condiciones o nuestra política de privacidad, no dudes en contactarnos.\"\r\n"
							+ "\r\n"
							+ "Recuerda adaptar el texto a las necesidades específicas de tu aplicación y a las leyes y regulaciones aplicables en tu jurisdicción. Además, se recomienda consultar con un asesor legal para asegurarse de que el texto cumpla con todos los requisitos legales pertinentes.");
			logger.info("Enviado un correo a: " + usuario.getEmail());
			return true;
		} catch (Exception e) {
			logger.error("Error al intentar enviar un correo a " + usuario.getEmail() + " - ERROR: " + e.getMessage());
			return false;
		}
	}

	// Endpoint para verificar el email con un codigo recibido por mail.
	@GetMapping(path = "confirmarEmail/{codigoActivacion}")
	@ResponseBody
	public String confirmarEmail(PersistentEntityResourceAssembler assembler,
			@PathVariable("codigoActivacion") String codigoActivacion) {
		Usuario usuario = getUsuarioService().findByClaveActivacion(codigoActivacion);
		if (usuario.getEmail() != null) {
			usuario.setIsConfirmadoEmail(true);
			// Se elimina la secuencia de numeros aleatorios que invalidaban el password
			// codificado. El usuario ya puede loggearse.
			usuario.setPassword(usuario.getPassword().split("@@%")[1]);
			usuario.setRoles(new HashSet<>());
			usuario.getRoles().add(usuario.getRolSeleccionado());
			getUsuarioService().save(usuario);
			return "Se ha verificado tu email en VERMUTORERO.ES.";
		} else {
			return "Ha habido un error en la verificacion de tu correo";
		}
	}

	// Endpoint para confirmar que se ha realizado el pago de la suscripcion y
	// aumentar 31 dias la fecha fin de suscripcion.
	@GetMapping(path = "confirmarPago/{email}")
	@ResponseBody
	public void confirmarPago(PersistentEntityResourceAssembler assembler, @PathVariable("email") String email) {
		Usuario usuario = getUsuarioService().getByEmail(email).get();
		logger.info("Obteniendo usuario para confirmar pago: " + email);
		if (usuario.getEmail() != null) {
			usuario.setFechaFinSuscripcion(Instant.now().plus(Duration.ofDays(31)));
			getUsuarioService().save(usuario);
		}
	}

	// Obtener el usuario a partir de un token
	@PreAuthorize("isAuthenticated()")
	@GetMapping(path = "usuarioFromToken")
	@ResponseBody
	public PersistentEntityResource usuarioFromToken(PersistentEntityResourceAssembler assembler,
			HttpServletRequest request) {
		return assembler.toModel(getUsuarioService().getUsuarioFromToken(request));
	}

	// Obtener el usuario a partir de un token
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER') OR hasRole('ROLE_USER_MEMBER')")
	@GetMapping(path = "usuarioFromId/{id}")
	@ResponseBody
	public PersistentEntityResource usuarioFromId(PersistentEntityResourceAssembler assembler, @PathVariable Long id) {
		return assembler.toModel(getUsuarioService().getUsuarioFromId(id));
	}
	
	// Obtener el usuario a partir de un token
		@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER') OR hasRole('ROLE_USER_MEMBER')")
		@GetMapping(path = "usuarioFromMensaje/{id}")
		@ResponseBody
		public PersistentEntityResource usuarioFromMensaje(PersistentEntityResourceAssembler assembler,
				 @PathVariable Long id) {
			return assembler.toModel(getUsuarioService().getUsuarioFromMensaje_Id(id));
		}
	
	// Metodos get de Usuarios
	
	// Obtener todos los usuarios exceptuando los eliminados
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping(path = "usuarios")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getUsuarios(PersistentEntityResourceAssembler assembler) {
	    return assembler.toCollectionModel(getUsuarioService().getUsuarios());
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping(path = "usuariosAdmin")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getUsuariosAdmin(PersistentEntityResourceAssembler assembler) {
	    return assembler.toCollectionModel(getUsuarioService().getAdmins());
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping(path = "usuariosMiembros")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getUsuariosMiembros(PersistentEntityResourceAssembler assembler) {
		return assembler.toCollectionModel(getUsuarioService().getMembers());
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping(path = "usuariosSuscritos")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getUsuariosSuscritos(PersistentEntityResourceAssembler assembler) {
		return assembler.toCollectionModel(getUsuarioService().getSubscribed());
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping(path = "usuariosEscritores")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getUsuariosEscritores(PersistentEntityResourceAssembler assembler) {
		return assembler.toCollectionModel(getUsuarioService().getWriters());
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping(path = "usuariosRegistrados")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getUsuariosRegistrados(PersistentEntityResourceAssembler assembler) {
		return assembler.toCollectionModel(getUsuarioService().getRegistered());
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping(path = "usuariosRegistradosNoConfirmados")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getUsuariosRegistardosNoConfirmados(PersistentEntityResourceAssembler assembler) {
		return assembler.toCollectionModel(getUsuarioService().getNotRegistered());
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping(path = "usuariosExpirados")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getUsuarioExpirados(PersistentEntityResourceAssembler assembler) {
		return assembler.toCollectionModel(getUsuarioService().getExpired());
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping(path = "usuariosEliminados")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getUsuariosEliminados(PersistentEntityResourceAssembler assembler) {
		return assembler.toCollectionModel(getUsuarioService().getDeleted());
	}
	
	// Obtener los usuarios con permiso de crear y modificar una publicacion
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_WRITER')")
	@GetMapping(path = "autores")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getAutores(PersistentEntityResourceAssembler assembler) {
		return assembler.toCollectionModel(getUsuarioService().getAutores());
	}

	// Modificar un usuario
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PatchMapping(path = "modificarUsuario")
	@ResponseBody
	public PersistentEntityResource modificarUsuario(PersistentEntityResourceAssembler assembler,
			@RequestBody Usuario usuarioModificado) {
		Usuario usuarioAntiguo = getUsuarioService().findById(usuarioModificado.getId()).get();
		logger.info("MODIFICANDO USUARIO ANTIGUO: " + usuarioAntiguo);
		logger.info("USUARIO NUEVO: " + usuarioModificado);
		usuarioAntiguo.setNombre(usuarioModificado.getNombre());
		usuarioAntiguo.setApellido1(usuarioModificado.getApellido1());
		usuarioAntiguo.setApellido2(usuarioModificado.getApellido2());
		usuarioAntiguo.setEmail(usuarioModificado.getEmail());
		usuarioAntiguo.setFechaFinSuscripcion(usuarioModificado.getFechaFinSuscripcion());
		Set<Rol> roles = usuarioModificado.getRoles();
		Rol rol = roles.iterator().next();
		roles = new HashSet<>();
		roles.add(usuarioService.getRolByRolNombre(usuarioModificado.getRoles().iterator().next().getRolNombre().toString()));
		usuarioAntiguo.setRoles(roles);
		getUsuarioService().save(usuarioAntiguo);
		return assembler.toModel(usuarioAntiguo);
	}

	// Modificar los datos del usuario por si mismo con un token
	@PreAuthorize("isAuthenticated()")
	@PatchMapping(path = "renovarUsuario")
	@ResponseBody
	public PersistentEntityResource renovarUsuario(PersistentEntityResourceAssembler assembler,
			@RequestBody Usuario usuarioModificado, HttpServletRequest request) {
		
		Usuario usuarioAntiguo = getUsuarioService().getUsuarioFromToken(request);
		usuarioAntiguo.setNombre(usuarioModificado.getNombre());
		usuarioAntiguo.setApellido1(usuarioModificado.getApellido1());
		usuarioAntiguo.setApellido2(usuarioModificado.getApellido2());
		usuarioAntiguo.setEmail(usuarioModificado.getEmail());
		Set<Rol> roles = usuarioModificado.getRoles();
		Rol rol = roles.iterator().next();
		roles = new HashSet<>();
		roles.add(getRolService().getByRolNombre(rol.getRolNombre()).get());
		usuarioAntiguo.setRoles(roles);
		getUsuarioService().save(usuarioAntiguo);
		usuarioAntiguo.setPassword("pass");
		return assembler.toModel(usuarioAntiguo);
	}


	// Eliminar un usuario por parte de un admin
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@DeleteMapping(path = "eliminarUsuarioAdmin/{id}")
	@ResponseBody
	public ResponseEntity<String> eliminarUsuario(PersistentEntityResourceAssembler assembler,
			@PathVariable("id") Long id) {
		try {
			Usuario usuario = getUsuarioService().getById(id).get();
			usuario.setNombre("" + usuario.getNombre().charAt(0));
			usuario.setApellido1("" + usuario.getApellido1().charAt(0));
			usuario.setApellido2("" + usuario.getApellido2().charAt(0));
			Random random = new Random();
			int numero =  random.nextInt(900) + 100;
			usuario.setEmail(usuario.getEmail() + "/deleted/" + numero);
			usuario.setPassword("password");
			Rol rolDefault = getRolService().getByRolNombre(RolNombre.ROLE_DELETED).get();
			Set<Rol> roles = new HashSet<>();
			roles.add(rolDefault);
			usuario.setRoles(roles);
			getUsuarioService().save(usuario);
			logger.info("Usuario eliminado con id: " + usuario.getId());
			return ResponseEntity.status(HttpStatus.OK).body("Usuario eliminado");
		} catch (Exception e) {
			logger.error("Error al intentar eliminar usuario con id: " + id);
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Usuario no encontrado");
		}
	}
	
	//Eliminar un usuario por parte del mismo usuario
	@PreAuthorize("isAuthenticated()")
	@DeleteMapping(path = "deleteUsuarioFromToken")
	@ResponseBody
	public ResponseEntity<String> deleteUsuarioFromToken(PersistentEntityResourceAssembler assembler,
			HttpServletRequest request) {
		try {
			Usuario usuario = getUsuarioService().getUsuarioFromToken(request);
			usuario.setNombre("" + usuario.getNombre().charAt(0));
			usuario.setApellido1("" + usuario.getApellido1().charAt(0));
			usuario.setApellido2("" + usuario.getApellido2().charAt(0));
			usuario.setEmail(usuario.getEmail() + "/deleted");
			usuario.setPassword("password");
			Rol rolDefault = getRolService().getByRolNombre(RolNombre.ROLE_DELETED).get();
			Set<Rol> roles = new HashSet<>();
			roles.add(rolDefault);
			usuario.setRoles(roles);
			getUsuarioService().save(usuario);
			logger.info("Usuario eliminado con id: " + usuario.getId());
			return ResponseEntity.status(HttpStatus.OK).body("Usuario eliminado");
		} catch (Exception e) {
			logger.error("Error al intentar eliminar usuario con token...");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Usuario no encontrado");
		}
	}

	// Obtener los roles a partir del id de un usuario
	@PreAuthorize("isAuthenticated()")
	@GetMapping(path = "getRolesFromUsuario/{idUsuario}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getRolesFromUser(PersistentEntityResourceAssembler assembler,
			@PathVariable("idUsuario") Long idUsuario) {
		logger.info("Consultando roles de usuario con Id: " + idUsuario);
		Usuario usuario = getUsuarioService().findById(idUsuario).get();
		Set<Rol> roles = usuario.getRoles();
		logger.info("Roles del usuario: " + roles);
		return assembler.toCollectionModel(roles);
	}

	// Obtener los roles a partir del email del usario
	@GetMapping(path = "getRolesFromEmail/{email}")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getRolesFromEmail(PersistentEntityResourceAssembler assembler,
			@PathVariable("email") String email) {
		Usuario usuario = getUsuarioService().findByEmail(email).get();
		Set<Rol> roles = usuario.getRoles();
		return assembler.toCollectionModel(roles);
	}

	@GetMapping(path = "isConfirmed/{email}")
	@ResponseBody
	public PersistentEntityResource getConfirmedByEmail(PersistentEntityResourceAssembler assembler,
			@PathVariable("email") String email) {
		Usuario usuario = getUsuarioService().findByEmail(email).get();
		usuario.setPassword("password");
		usuario.setClaveActivacion("12345678");
		return assembler.toModel(usuario);
	}

	@GetMapping(path = "roles")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getRoles(PersistentEntityResourceAssembler assembler) {
		return assembler.toCollectionModel(getRolService().getAll());
	}

	@GetMapping(path = "enviarCorreoOlvidoPassword/{email}")
	@ResponseBody
	public boolean enviarCorreoCambioPassword(PersistentEntityResourceAssembler assembler,
			@PathVariable("email") String email, HttpServletRequest request) {
		try {
			Random random = new Random();
			int claveRecuperacion = random.nextInt(90000000) + 10000000;
			Usuario usuario = getUsuarioService().getByEmail(email).get();
			usuario.setClaveRecuperacion(String.valueOf(claveRecuperacion));
			UserDetails userDetails = getUserDetailsService().loadUserByUsername(email);
			logger.info("USER DETAILS: " + userDetails);
			String token = getJwtProvider().generateTokenFromUserDetails(userDetails);
			logger.info("TOKEN DE RECUPERACION GENERADO: " + token);
			String endpoint = "https://webmagazine-3758a.web.app/security/usuario-editar/";

			getEmailSender().sendEmail(email, "cambio de password",
					"Haz click en el siguiente enlace para cambiar tu password: " + endpoint + "?"
							+ "claveRecuperacion=" + usuario.getClaveRecuperacion() + "&email=" + usuario.getEmail());
			logger.info("EMAIL DE RECUPERACION ENVIADO A: " + usuario.getEmail());
			return true;
		} catch (Exception e) {
			logger.info("ERROR ENVIANDO EMAIL DE CAMBIO DE PASSWORD:");
			return false;
		}
	}

	@GetMapping(path = "getTokenFromClaveRecuperacion/{claveRecuperacion}/{email}")
	@ResponseBody
	public String getTokenFromClaveRecuperacion(@PathVariable("claveRecuperacion") String claveRecuperacion,
			@PathVariable("email") String email) {
		String token = "";
		Usuario usuario = getUsuarioService().findByClaveRecuperacion(claveRecuperacion);
		if (usuario.getEmail().equals(email)) {
			UserDetails userDetails = getUserDetailsService().loadUserByUsername(usuario.getEmail());
			logger.info("USER DETAILS: " + userDetails);
			token = getJwtProvider().generateTokenFromUserDetails(userDetails);
		}
		Random random = new Random();
		int claveRecuperacionNueva = random.nextInt(90000000) + 10000000;
		usuario.setClaveRecuperacion(String.valueOf("48934392" + claveRecuperacionNueva + "34J59875"));
		logger.info("GENNERADO TOKEN A PARTIR DE CLAVE DE RECUPERACION PARA: " + usuario.getEmail());
		return token;
	}

	@PreAuthorize("isAuthenticated()")
	@PostMapping(path = "cambiarPassword")
	@ResponseBody
	public PersistentEntityResource cambiarPassword(PersistentEntityResourceAssembler assembler,
			@RequestBody Usuario usuarioModificado, HttpServletRequest request) {
		Usuario usuarioAntiguo = getUsuarioService().getUsuarioFromToken(request);
		if (usuarioAntiguo.getEmail().equals(usuarioModificado.getEmail())) {
			usuarioAntiguo.setPassword(getPasswordEncoder().encode(usuarioModificado.getPassword()));
			getUsuarioService().save(usuarioAntiguo);
		}
		logger.info("Password cambiada para: " + usuarioAntiguo.getEmail());
		return assembler.toModel(usuarioModificado);
	}

	@PreAuthorize("isAuthenticated()")
	@GetMapping(path = "getDireccionesFromUsuario")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getDireccionesFromToken(
			PersistentEntityResourceAssembler assembler, HttpServletRequest request) {
		Usuario usuario = getUsuarioService().getUsuarioFromToken(request);
		logger.info(usuario.getEmail() + " CONSULTA SUS DIRECCIONES");
		return assembler.toCollectionModel(usuario.getDirecciones());
	}



}
