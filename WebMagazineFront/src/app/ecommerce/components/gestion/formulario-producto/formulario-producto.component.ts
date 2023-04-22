import { Component, ViewChild } from '@angular/core';
import { CropperComponent } from 'angular-cropperjs';
import { Product } from 'src/app/ecommerce/models/product';

@Component({
  selector: 'app-formulario-producto',
  templateUrl: './formulario-producto.component.html',
  styleUrls: ['./formulario-producto.component.css']
})
export class FormularioProductoComponent {
  @ViewChild('angularCropper') angularCropper: CropperComponent = new CropperComponent;
  nuevoProducto: Product = new Product("", "", 0 , "");
  viejoProducto: String = '';
   /* Recortador de imagenes */
   imageUrl: string = "";
   imageName: string = "";
   croppedresult = "";
   anchoImagen: string = "100";

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
       /* Revisar luego
        this.imagenesService.subirImagen(imagenRecortada, this.publicacion.id, "preview").subscribe(url => {
          console.log("URL IMG", url)
          setTimeout(() => {
            console.log("URL IMAGEN SUBIDA: ", url)
            this.insertarImagenUrl(url);
          }, 2000)
        });
        */

      }
    }, 'image/jpeg', 0.70)
  }

  getCroppedImageAutor() {
    // this.croppedresult = this.angularCropper.cropper.getCroppedCanvas().toDataURL();
    this.angularCropper.cropper.getCroppedCanvas().toBlob((blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob as Blob);
      reader.onload = () => {
        this.croppedresult = reader.result as string;
        let blobGenerado = blob as Blob;
        let imagenRecortada = new File([blobGenerado], this.imageName, { type: "image/jpeg" })
        /* Revisar luego
        this.imagenesService.subirImagen(imagenRecortada, this.publicacion.id, "preview").subscribe(url => {
          console.log("URL IMG", url)
          setTimeout(() => {
            this.insertarImagenAutorUrl(url);
          }, 2000)
        });
        */
      }
    }, 'image/jpeg', 0.70)
  }

  getCroppedImagePreview() {
    this.angularCropper.cropper.setAspectRatio(16 / 9);
    // this.croppedresult = this.angularCropper.cropper.getCroppedCanvas().toDataURL();
    this.angularCropper.cropper.getCroppedCanvas().toBlob((blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob as Blob);
      reader.onload = () => {
        this.croppedresult = reader.result as string;
        let blobGenerado = blob as Blob;
        let imagenRecortada = new File([blobGenerado], this.imageName, { type: "image/jpeg" })
        /* Revisar luego
        this.imagenesService.subirImagen(imagenRecortada, this.publicacion.id, "preview").subscribe(url => {
          setTimeout(() => {
            console.log("URL IMG", url)
            this.setImagePreview(url)
            url = []
          }, 2000)
        });
        */
      }
    }, 'image/jpeg', 0.70)
  }
}
