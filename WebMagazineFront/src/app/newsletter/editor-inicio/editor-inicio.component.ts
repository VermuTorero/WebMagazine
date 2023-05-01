import { Component, OnInit, ViewChild } from '@angular/core';
import { Publicacion } from '../models/publicacion';
import { PublicacionesServiceService } from '../service/publicaciones.service';
import { CropperComponent } from 'angular-cropperjs';
import { ImagenesService } from '../service/imagenes.service';
import { ImagenInicio } from '../models/imagenInicio';

@Component({
  selector: 'app-editor-inicio',
  templateUrl: './editor-inicio.component.html',
  styleUrls: ['./editor-inicio.component.css']
})
export class EditorInicioComponent implements OnInit {
  @ViewChild('angularCropper') angularCropper: CropperComponent = new CropperComponent;
  @ViewChild('angularCropper2') angularCropper2: CropperComponent = new CropperComponent;
  @ViewChild('angularCropper3') angularCropper3: CropperComponent = new CropperComponent;
  publicaciones: Publicacion[] = [];
  publicacionesCarousel: Publicacion[] = [];
  publicacionesNoCarousel: Publicacion[] = [];
  /* Recortador de imagenes */
  imageUrl: string = "";
  imagePreviewUrl = "";
  imageName: string = "";
  croppedresult = "";
  anchoImagen: string = "100";

  imagenInicioDerecha : ImagenInicio = new ImagenInicio();
  imagenInicioIzquierda: ImagenInicio = new ImagenInicio();
  imagenInicioCentral: ImagenInicio = new ImagenInicio();

  constructor(private publicacionesService: PublicacionesServiceService,
    private imagenesService: ImagenesService) {

  }
  ngOnInit(): void {
    this.getPublicaciones();
    this.getImagenesInicio();
    this.imagenInicioDerecha.id = "1";
    this.imagenInicioDerecha.posicion = "derecha";
    this.imagenInicioIzquierda.id = "2";
    this.imagenInicioIzquierda.posicion = "izquierda";
    this.imagenInicioCentral.id = "3";
    this.imagenInicioCentral.posicion = "centro";
  }
  getPublicaciones() {
    this.publicacionesCarousel = [];
    this.publicacionesNoCarousel = [];
    this.publicacionesService.getPublicacionesCarousel().subscribe(publicaciones => {
      this.publicacionesCarousel = publicaciones;
      this.publicacionesCarousel.forEach(publicacion => {
        publicacion.id = this.publicacionesService.getId(publicacion);
        publicacion.subtitulo = publicacion.subtitulo.substring(0,70) + "..."
        this.publicacionesService.getPublicacionesNoCarousel().subscribe(publicaciones=>{
          this.publicacionesNoCarousel = publicaciones;
          this.publicacionesNoCarousel.forEach(publicacion => {
            publicacion.id = this.publicacionesService.getId(publicacion);
            publicacion.subtitulo = publicacion.subtitulo.substring(0,70) + "..."
          });
        })
      });
    })
  }
  quitarDelCarousel(id: string) {
    this.publicacionesService.getPublicacionById(id).subscribe(publicacion => {
      publicacion.id = id;
      publicacion.carousel = false;
      this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor => {
        autor.id = this.publicacionesService.getId(autor);
        publicacion.autor = autor;
        console.log("Autor: ", autor);
        this.publicacionesService.getCategoriaFromPublicacion(publicacion).subscribe(categoria => {
          categoria.id = this.publicacionesService.getId(categoria);
          publicacion.categoria = categoria;
          this.publicacionesService.getTagsFromPublicacion(publicacion).subscribe(tags => {
            tags.forEach(tag => {
              tag.id = this.publicacionesService.getId(tag);
            });
            publicacion.tags = tags;
            this.publicacionesService.patchPublicacion(publicacion).subscribe(publicacion => {
              this.getPublicaciones();
              this.getImagenesInicio();
            })
          })
        })
      })
    })
  }
  agregarAlCarousel(id: string) {
    this.publicacionesService.getPublicacionById(id).subscribe(publicacion => {
      publicacion.id = id;
      publicacion.carousel = true;
      this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor => {
        autor.id = this.publicacionesService.getId(autor);
        publicacion.autor = autor;
        console.log("Autor: ", autor);
        this.publicacionesService.getCategoriaFromPublicacion(publicacion).subscribe(categoria => {
          categoria.id = this.publicacionesService.getId(categoria);
          publicacion.categoria = categoria;
          this.publicacionesService.getTagsFromPublicacion(publicacion).subscribe(tags => {
            tags.forEach(tag => {
              tag.id = this.publicacionesService.getId(tag);
            });
            publicacion.tags = tags;
            this.publicacionesService.patchPublicacion(publicacion).subscribe(publicacion => {
              this.getPublicaciones();
              this.getImagenesInicio();
            })
          })
        })
      })
    })
  }
  
  onSelectFile(event: any) {

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
        this.imagenInicioDerecha.url = this.imagePreviewUrl;
      }
      console.log("EVENT", event.target.files[0])
      this.imageName = event.target.files[0].name;

    }
    console.log("IMAGEN SELECCIONADA EN PC: ", this.imagePreviewUrl)
  }
  onSelectFileIzquierda(event: any) {

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
        this.imagenInicioIzquierda.url = this.imagePreviewUrl;
      }
      console.log("EVENT", event.target.files[0])
      this.imageName = event.target.files[0].name;

    }
    console.log("IMAGEN SELECCIONADA EN PC: ", this.imagePreviewUrl)
  }

  onSelectFileCentral(event: any) {

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
        this.imagenInicioCentral.url = this.imagePreviewUrl;
      }
      console.log("EVENT", event.target.files[0])
      this.imageName = event.target.files[0].name;

    }
    console.log("IMAGEN SELECCIONADA EN PC: ", this.imagePreviewUrl)
  }

  getCroppedImageDerecha() {
    // this.croppedresult = this.angularCropper.cropper.getCroppedCanvas().toDataURL();
    this.angularCropper.cropper.getCroppedCanvas().toBlob((blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob as Blob);
      reader.onload = () => {
        this.croppedresult = reader.result as string;
        let blobGenerado = blob as Blob;
        let imagenRecortada = new File([blobGenerado], this.imageName, { type: "image/jpeg" })
        this.imagenesService.subirImagen(imagenRecortada, "imagenLateralDerecha", "lateral").subscribe(url => {
          console.log("URL IMAGEN SUBIDA: ", url)
          this.imagenInicioDerecha.url = url;
          this.setImagenInicioDerecha();
        })
      }
    }, 'image/jpeg', 0.70)
  }
  getCroppedImageIzquierda() {
    // this.croppedresult = this.angularCropper.cropper.getCroppedCanvas().toDataURL();
    this.angularCropper2.cropper.getCroppedCanvas().toBlob((blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob as Blob);
      reader.onload = () => {
        this.croppedresult = reader.result as string;
        let blobGenerado = blob as Blob;
        let imagenRecortada = new File([blobGenerado], this.imageName, { type: "image/jpeg" })
        this.imagenesService.subirImagen(imagenRecortada, "imagenLateralIzquierda", "inicio").subscribe(url => {
          console.log("URL IMAGEN SUBIDA: ", url)
          this.imagenInicioIzquierda.url = url;
          this.setImagenInicioIzquierda();
        })
      }
    }, 'image/jpeg', 0.70)
  }
  getCroppedImageCentral() {
    // this.croppedresult = this.angularCropper.cropper.getCroppedCanvas().toDataURL();
    this.angularCropper3.cropper.getCroppedCanvas().toBlob((blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob as Blob);
      reader.onload = () => {
        this.croppedresult = reader.result as string;
        let blobGenerado = blob as Blob;
        let imagenRecortada = new File([blobGenerado], this.imageName, { type: "image/jpeg" })
        this.imagenesService.subirImagen(imagenRecortada, "imagenCentral", "inicio").subscribe(url => {
          console.log("URL IMAGEN SUBIDA: ", url)
          this.imagenInicioCentral.url = url;
          this.setImagenInicioCentral();
        })
      }
    }, 'image/jpeg', 0.70)
  }

  getImagenesInicio() {
    this.imagenesService.getImagenesInicio().subscribe(imagenesInicio => {
      imagenesInicio.forEach(imagenInicio => {
        if (imagenInicio.posicion == "derecha") {
          this.imagenInicioDerecha = imagenInicio;
        }
        if(imagenInicio.posicion == "izquierda"){
          this.imagenInicioIzquierda = imagenInicio;
        }
        if(imagenInicio.posicion == "centro"){
          this.imagenInicioCentral = imagenInicio;
        }
      });
    })
  }
  setImagenInicioDerecha(){
    this.imagenesService.setImagenInicioDerecha(this.imagenInicioDerecha).subscribe(imagenInicioDerecha=>{
      this.imagenInicioDerecha = imagenInicioDerecha;
    })
  }
  setImagenInicioIzquierda(){
    this.imagenesService.setImagenInicioIzquierda(this.imagenInicioIzquierda).subscribe(imagenInicioIzquierda=>{
      this.imagenInicioIzquierda = imagenInicioIzquierda;
    })
  }
  setImagenInicioCentral(){
    this.imagenesService.setImagenInicioCentral(this.imagenInicioCentral).subscribe(imagenInicioCentral=>{
      this.imagenInicioCentral = imagenInicioCentral;
    })
  }
}
