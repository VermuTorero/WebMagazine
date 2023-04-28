package com.peterfonkel.webMagazine;


import java.util.Arrays;
import java.util.Collections;

import org.hibernate.cfg.Environment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.peterfonkel.webMagazine.entities.ImagenInicio;
import com.peterfonkel.webMagazine.entities.Lugar;
import com.peterfonkel.webMagazine.repositories.ImagenInicioDAO;
import com.peterfonkel.webMagazine.repositories.LugarDAO;



@Configuration
@ComponentScan("peterfonkel")
public class ClaseConfiguracionJava {
	@Value("${provincias}") 
	private String[] provincias;

	@Autowired
	LugarDAO lugarDAO;
	
	@Autowired
	ImagenInicioDAO imagenInicioDAO;
	
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
    		ImagenInicio imagenInicio = new ImagenInicio(1L, "", true);
    		imagenInicioDAO.save(imagenInicio);
    		ImagenInicio imagenInicio2 = new ImagenInicio(2L, "", false);
    		imagenInicioDAO.save(imagenInicio2);
    		
		}
    }
}
