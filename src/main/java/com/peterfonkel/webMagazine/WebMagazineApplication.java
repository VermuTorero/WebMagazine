package com.peterfonkel.webMagazine;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.SpringApplication;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.ImportResource;

import com.peterfonkel.webMagazine.entities.Cafe;
import com.peterfonkel.webMagazine.entities.Like;
import com.peterfonkel.webMagazine.entities.Usuario;
import com.peterfonkel.webMagazine.repositories.UsuarioDAO;

@SpringBootApplication
@EnableCaching
@ImportResource({ "classpath:config/jpa-config.xml" })
public class WebMagazineApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebMagazineApplication.class, args);
		System.out.println("Iniciando aplicacion Web Magazine");
		List<Like> likes = new ArrayList<Like>();
		List<Cafe> cafes = new ArrayList<Cafe>();
		Usuario usuarioPrueba = new Usuario("Paco","Perez","Lopez","38", "premium",likes , cafes);
	}

}

