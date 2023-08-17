package com.peterfonkel.webMagazine.services;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.peterfonkel.webMagazine.entities.Publicacion;

@Service
public class PublicacionScheduledService {

    @Autowired
    private PublicacionesService publicacionesService;
    
    

    public PublicacionesService getPublicacionesService() {
		return publicacionesService;
	}



	@Scheduled(fixedRate = 3600000) // 1 hora en milisegundos 3600000
    public void procesarPublicacionesPendientes() {
        try {
            List<Publicacion> listaPublicaciones = getPublicacionesService().findByIsPublicadoFalse();
            Instant ahora = Instant.now();
            
            for (Publicacion publicacion : listaPublicaciones) {
                if (!publicacion.isPublicado()) {
                    Instant fechaFutura = publicacion.getFechaPublicacionFutura();
                    if (fechaFutura != null && fechaFutura.isBefore(ahora)) {
                        publicacion.setPublicado(true);
                        getPublicacionesService().save(publicacion);
                    }
                }
            }
        } catch (Exception e) {
            // Manejar la excepción adecuadamente
            e.printStackTrace(); // Opcional: registrar la excepción
        }
    }
}
