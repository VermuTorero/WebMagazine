package com.peterfonkel.webMagazine;


import org.springframework.boot.SpringApplication;



import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.ImportResource;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.peterfonkel.webMagazine.login.UsuariosController;


@SpringBootApplication
@EnableCaching
@EnableScheduling
@ImportResource({ "classpath:config/jpa-config.xml" })
@Import({ ClaseConfiguracionJava.class})
public class WebMagazineApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebMagazineApplication.class, args);
		System.out.println("Iniciando aplicacion Web Magazine");

	}

}

