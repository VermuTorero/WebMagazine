package com.peterfonkel.webMagazine;


import java.util.Arrays;


import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.peterfonkel.webMagazine.entities.Categoria;
import com.peterfonkel.webMagazine.entities.ImagenInicio;
import com.peterfonkel.webMagazine.entities.Lateral;
import com.peterfonkel.webMagazine.entities.Lugar;
import com.peterfonkel.webMagazine.login.jwt.JwtProvider;
import com.peterfonkel.webMagazine.login.roles.Rol;
import com.peterfonkel.webMagazine.login.roles.RolDAO;
import com.peterfonkel.webMagazine.login.roles.enums.RolNombre;
import com.peterfonkel.webMagazine.login.usuarios.UsuarioDAO;
import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;
import com.peterfonkel.webMagazine.repositories.CategoriaDAO;
import com.peterfonkel.webMagazine.repositories.ImagenInicioDAO;
import com.peterfonkel.webMagazine.repositories.LateralDAO;
import com.peterfonkel.webMagazine.repositories.LugarDAO;
import com.peterfonkel.webMagazine.rest.mixins.Mixins;



@Configuration
@ComponentScan("peterfonkel")
public class ClaseConfiguracionJava {
	

	private final static Logger logger = LoggerFactory.getLogger(JwtProvider.class);
	
	@Value("${provincias}") 
	private String[] provincias;
	
	@Value("${secretPsw}")
	String secretPsw;

	@Value("${correoAdmin}")
	String correoAdmin;

	@Autowired
	LugarDAO lugarDAO;
	
	@Autowired
	ImagenInicioDAO imagenInicioDAO;
	
	@Autowired
	LateralDAO lateralDAO;
	
	@Autowired
	RolDAO rolDAO;

	@Autowired
	UsuarioDAO usuarioDAO;

	
	@Autowired
	CategoriaDAO categoriaDAO;

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
    public void setProvincias() {
    	if (lugarDAO.findAll().size()<1) {	
    		for (String provincia : provincias) {
    			Lugar lugar = new Lugar();
    			provincia = provincia.replaceAll("'", "");
				lugar.setLugarNombre(provincia);
				lugarDAO.save(lugar);
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
//		mapper.addMixIn(Usuario.class, Mixins.Usuario.class);
		return mapper;
	}
	
	@Bean
	public void inicializarBD() {
		logger.info("Iniciando la BD, cargando Roles iniciales y ADMIN");
		/*
		 * cargo los roles de enum.Rolnombre
		 */
		for (RolNombre rol : RolNombre.values()) {
			Rol rolNuevo = new Rol(rol);
			if (!rolDAO.existsByRolNombre(rol)) {
				rolDAO.save(rolNuevo);
			}
		}

		/*
		 * cargo el usuario administrador si no existe en la BD
		 */
		if (!usuarioDAO.existsByEmail(correoAdmin)) {
			Usuario usuarioAdmin = new Usuario(correoAdmin, passwordEncoder.encode(secretPsw));
			usuarioAdmin.setNombre("Elisabeth");
			usuarioAdmin.setApellido1("G.");
			usuarioAdmin.setApellido2("Iborra");
			Rol rolAdmin = rolDAO.findByRolNombre(RolNombre.ROLE_ADMIN).get();
			Set<Rol> roles = new HashSet<>();
			roles.add(rolAdmin);
			usuarioAdmin.setRoles(roles);
			usuarioDAO.save(usuarioAdmin);
		}
	
		if (categoriaDAO.findAll().size()<1) {
			Categoria categoria = new Categoria();
			categoria.setCategoriaNombre("Gastrosofia");
			categoriaDAO.save(categoria);
		}
	}
}
