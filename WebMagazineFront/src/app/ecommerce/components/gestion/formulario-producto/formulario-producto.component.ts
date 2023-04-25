import { Component, ViewChild } from '@angular/core';
import { CropperComponent } from 'angular-cropperjs';
import { Product } from 'src/app/ecommerce/models/product';
import { Seccion } from 'src/app/ecommerce/models/seccion';
import { ProductService } from 'src/app/ecommerce/service/product.service';
import { SeccionService } from 'src/app/ecommerce/service/seccion.service';
import { ImagenesService } from 'src/app/newsletter/service/imagenes.service';

@Component({
  selector: 'app-formulario-producto',
  templateUrl: './formulario-producto.component.html',
  styleUrls: ['./formulario-producto.component.css']
})
export class FormularioProductoComponent {
  @ViewChild('angularCropper') angularCropper: CropperComponent = new CropperComponent;
  nuevoProducto: Product = new Product(0,"", "","", 0, "","");
  selectedSeccionUrl: string = "";

  /* Recortador de imagenes */
  imageUrl: string = "";
  imageName: string = "";
  croppedresult = "";
  anchoImagen: string = "100";
  secciones: Seccion[] = [];

  constructor(private imagenesService: ImagenesService, private seccionesService: SeccionService, private productoService: ProductService) {
    this.seccionesService.getSecciones().subscribe((response) =>{
      this.secciones = response;
      this.secciones.forEach((seccion) => {
        seccion.url = this.seccionesService.extraerUrlSeccion(seccion);
        console.log(this.secciones);
      });
    }
    );
  }


  submitProducto(form: any) {
    console.log(this.nuevoProducto);
    this.productoService.postProducto(this.nuevoProducto).subscribe((res) => {
    console.log(res);
    });
  }

  /* metodos para el croper */
  onSelectFile(event: any) {

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      }
      console.log("EVENT", event.target.files[0])
      this.imageName = event.target.files[0].name;
    }
    console.log("IMAGEN SELECCIONADA EN PC: ", this.imageUrl)
  }

  getCroppedImage() {
    // this.croppedresult = this.angularCropper.cropper.getCroppedCanvas().toDataURL();
    this.angularCropper.cropper.getCroppedCanvas().toBlob((blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob as Blob);
      reader.onload = () => {
        this.croppedresult = reader.result as string;
        let blobGenerado = blob as Blob;
        let imagenRecortada = new File([blobGenerado], this.imageName, { type: "image/jpeg" })
        this.imagenesService.subirImagen(imagenRecortada, this.nuevoProducto.nombreProducto, "producto").subscribe(url => {
          console.log("URL IMG", url)
          setTimeout(() => {
            console.log("URL IMAGEN SUBIDA: ", url)
            this.nuevoProducto.url = url[0];
          }, 2000)
        });
      }
    }, 'image/jpeg', 0.70)
  }
}
