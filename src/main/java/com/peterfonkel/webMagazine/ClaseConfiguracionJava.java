package com.peterfonkel.webMagazine;


import java.time.Instant;

import java.util.ArrayList;


import java.util.Arrays;


import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.hibernate.mapping.Array;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.relational.core.sql.IdentifierProcessing.LetterCasing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.peterfonkel.webMagazine.entities.Categoria;
import com.peterfonkel.webMagazine.entities.ImagenInicio;
import com.peterfonkel.webMagazine.entities.Lateral;
import com.peterfonkel.webMagazine.entities.Lugar;
import com.peterfonkel.webMagazine.entities.Publicacion;
import com.peterfonkel.webMagazine.entities.TipoSuscripcion;
import com.peterfonkel.webMagazine.login.jwt.JwtProvider;
import com.peterfonkel.webMagazine.login.roles.Rol;
import com.peterfonkel.webMagazine.login.roles.RolDAO;
import com.peterfonkel.webMagazine.login.roles.RolService;
import com.peterfonkel.webMagazine.login.roles.enums.RolNombre;
import com.peterfonkel.webMagazine.login.usuarios.UsuarioDAO;
import com.peterfonkel.webMagazine.login.usuarios.UsuarioService;
import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;
import com.peterfonkel.webMagazine.repositories.CategoriaDAO;
import com.peterfonkel.webMagazine.repositories.ImagenInicioDAO;
import com.peterfonkel.webMagazine.repositories.LateralDAO;
import com.peterfonkel.webMagazine.repositories.LugarDAO;
import com.peterfonkel.webMagazine.repositories.TipoSuscripcionDAO;
import com.peterfonkel.webMagazine.rest.mixins.Mixins;
import com.peterfonkel.webMagazine.services.CategoriaService;
import com.peterfonkel.webMagazine.services.LugarService;
import com.peterfonkel.webMagazine.services.PublicacionesService;





@Configuration
@ComponentScan("com.peterfonkel.webMagazine")
public class ClaseConfiguracionJava {
	

	private final static Logger logger = LoggerFactory.getLogger(JwtProvider.class);
	
	@Value("${provincias}") 
	private String[] provincias;
	
	@Value("${secretPsw}")
	String secretPsw;

	@Value("${correoAdmin}")
	String correoAdmin;
	
	@Value("${correo.remitente}")
	String username;
	
	@Value("${password.email}")
	String password;
	
	
	@Autowired
	LugarService lugarService;
	
	@Autowired
	ImagenInicioDAO imagenInicioDAO;
	
	@Autowired
	LateralDAO lateralDAO;
	
	@Autowired
	RolService rolService;

	@Autowired
	UsuarioService usuarioService;

	@Autowired
	PublicacionesService publicacionesService;
	
	@Autowired
	CategoriaService categoriaService;
	
	@Autowired
	TipoSuscripcionDAO tipoSuscripcionDAO;

	@Autowired
	PasswordEncoder passwordEncoder;
	

	
	@Bean
	   public CacheManager cacheManager() {
	      SimpleCacheManager cacheManager = new SimpleCacheManager();
	      cacheManager.setCaches(Arrays.asList(
	         new ConcurrentMapCache("myCache")));
	      return cacheManager;
	   }
	
	@Bean
	CorsFilter corsFilter() {
		final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		final CorsConfiguration config = new CorsConfiguration();
		config.setAllowCredentials(false);
		config.setAllowedOrigins(Collections.singletonList("*"));
		config.setAllowedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Authorization"));
		config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "OPTIONS", "DELETE", "PATCH"));
		source.registerCorsConfiguration("/**", config);

		return new CorsFilter(source);
	}

	
	@Bean
	public void inicializarBD() {
		logger.info("Iniciando la BD, cargando Roles iniciales y ADMIN");
		/*
		 * cargo los roles de enum.Rolnombre
		 */
		for (RolNombre rol : RolNombre.values()) {
			Rol rolNuevo = new Rol(rol);
			if (!rolService.existsRolNombre(rol)) {
				rolService.save(rolNuevo);
			}
		}

		/*
		 * cargo el usuario administrador si no existe en la BD
		 */
		if (!usuarioService.existsEmail(correoAdmin)) {
			Usuario usuarioAdmin = new Usuario(correoAdmin, passwordEncoder.encode(secretPsw));
			usuarioAdmin.setNombre("Elisabeth");
			usuarioAdmin.setApellido1("G.");
			usuarioAdmin.setApellido2("Iborra");
			usuarioAdmin.setIsConfirmadoEmail(true);
			usuarioAdmin.setFechaFinSuscripcion(Instant.now().plusMillis(864000000));
			Rol rolAdmin = rolService.getByRolNombre(RolNombre.ROLE_ADMIN).get();
			Set<Rol> roles = new HashSet<>();
			roles.add(rolAdmin);
			usuarioAdmin.setRoles(roles);
			usuarioService.save(usuarioAdmin);
//		  	Authentication authentication = authenticationManager.authenticate(
//					new UsernamePasswordAuthenticationToken(correoAdmin, secretPsw));
//			SecurityContextHolder.getContext().setAuthentication(authentication);
		}
	
		if (categoriaService.findAll().size()<3) {
			Categoria categoria = new Categoria();
			categoria.setCategoriaNombre("Patata Santa");
			categoriaService.save(categoria);
			
			Categoria categoria2 = new Categoria();
			categoria2.setCategoriaNombre("Restaurantes");
			categoriaService.save(categoria2);
			
			Categoria categoria3 = new Categoria();
			categoria3.setCategoriaNombre("Bares");
			categoriaService.save(categoria3);
			
			Categoria categoria4 = new Categoria();
			categoria4.setCategoriaNombre("Mercados");
			categoriaService.save(categoria4);
			
			Categoria categoria5 = new Categoria();
			categoria5.setCategoriaNombre("Entrevidas");
			categoriaService.save(categoria5);
			
			Categoria categoria6 = new Categoria();
			categoria6.setCategoriaNombre("Viajar a solas");
			categoriaService.save(categoria6);
			
			Categoria categoria7 = new Categoria();
			categoria7.setCategoriaNombre("Beber bien");
			categoriaService.save(categoria7);
			
			Categoria categoria8 = new Categoria();
			categoria8.setCategoriaNombre("Culturoides");
			categoriaService.save(categoria8);
			
			Categoria categoria9 = new Categoria();
			categoria9.setCategoriaNombre("Relaciones");
			categoriaService.save(categoria9);
			
			Categoria categoria10 = new Categoria();
			categoria10.setCategoriaNombre("Autocuidado");
			categoriaService.save(categoria10);
		}
		
		if(tipoSuscripcionDAO.findAll().size()<1) {
			
			TipoSuscripcion tipoSuscripcion1 = new TipoSuscripcion();
			TipoSuscripcion tipoSuscripcion2 = new TipoSuscripcion();
			TipoSuscripcion tipoSuscripcion3 = new TipoSuscripcion();
			tipoSuscripcion1.setNombre("Nombre1");
			tipoSuscripcion2.setNombre("Nombre2");
			tipoSuscripcion3.setNombre("Nombre3");
			tipoSuscripcion1.setCaracteristica1("caracteristica_1");
			tipoSuscripcion2.setCaracteristica1("caracteristica_1");
			tipoSuscripcion3.setCaracteristica1("caracteristica_1");
			tipoSuscripcionDAO.save(tipoSuscripcion1);
			tipoSuscripcionDAO.save(tipoSuscripcion2);
			tipoSuscripcionDAO.save(tipoSuscripcion3);
					
		}
	}
	

    @Bean
    public void setProvincias() {
    	if (lugarService.findAll().size()<1) {	
    		for (String provincia : provincias) {
    			Lugar lugar = new Lugar();
    			provincia = provincia.replaceAll("'", "");
				lugar.setLugarNombre(provincia);
				lugarService.save(lugar);
			}
		}
    }
    
    @Bean
    public void setImagenesInicio() {
    	if (imagenInicioDAO.findAll().size()<2) {	
    		ImagenInicio imagenInicio = new ImagenInicio(1L, "", "derecha");
    		imagenInicioDAO.save(imagenInicio);
    		ImagenInicio imagenInicio2 = new ImagenInicio(2L, "", "izquierda");
    		imagenInicioDAO.save(imagenInicio2);
    		ImagenInicio imagenInicio3 = new ImagenInicio(3L, "", "centro");
    		imagenInicioDAO.save(imagenInicio3);		
		}
    }
    
    @Bean
    public void setLateralVacio() {
    	if (lateralDAO.findAll().size()<1) {	
    		Lateral lateral = new Lateral("", "", "","");
    		lateralDAO.save(lateral);
		}
    }
    
    
	@Bean
	public ObjectMapper getObjectMapper() {
		ObjectMapper mapper = new ObjectMapper();
		return mapper;
	}	
}
