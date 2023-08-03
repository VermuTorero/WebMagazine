import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImagenInicio } from 'src/app/newsletter/models/imagenInicio';
import { ImagenesService } from 'src/app/newsletter/service/imagenes.service';

@Component({
  selector: 'app-promo-tienda',
  templateUrl: './promo-tienda.component.html',
  styleUrls: ['./promo-tienda.component.css']
})
export class PromoTiendaComponent implements OnInit {
  imagenPromoTienda: ImagenInicio = new ImagenInicio();

  constructor(private imagenesService: ImagenesService, private router: Router){}

  ngOnInit(): void {
    this.getImagen();
  }

  getImagen() {
    this.imagenesService.getImagenesInicio().subscribe(imagenesInicio => {
      console.log("IMAGENES INICIO: ", imagenesInicio)
      imagenesInicio.forEach(imagenInicio => {
        if (imagenInicio.posicion == "izquierda") {
          this.imagenPromoTienda = imagenInicio;
        }
      });
    })
  }
  irATienda(){
    this.router.navigate(['ecommerce']);
  }
}
