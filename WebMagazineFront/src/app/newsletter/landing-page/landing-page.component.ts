import { Component, OnInit, ViewChild } from '@angular/core';
import { LandingPage } from '../models/LandingPage';
import { LandingPagesServiceService } from '../service/landingPages.service';
import { CropperComponent } from 'angular-cropperjs';
import { ImagenesService } from '../service/imagenes.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit{
  @ViewChild('angularCropper') angularCropper: CropperComponent = new CropperComponent;
  landingPage: LandingPage = new LandingPage();
  edicion: boolean = false;
  imageUrl: string = "";
  imageName: string ="";
  croppedresult: string = "";
  subiendo: boolean = false;

  constructor(private landingPagesService: LandingPagesServiceService,
    private imagenesService: ImagenesService){
    
  }
  
  ngOnInit(): void {
   this.getLandingPage();
  }

  getLandingPage(){
    this.landingPagesService.getLandingPage().subscribe(landingPage=>{
      this.landingPage = landingPage;
      landingPage.id = this.landingPagesService.getId(landingPage);
    })
  }
  postLandingPage(){
    this.landingPagesService.patchLandingPage(this.landingPage).subscribe(landingPage=>{
      this.landingPage = landingPage;
      this.landingPage.id = this.landingPagesService.getId(this.landingPage);
    })
  }
  patchLandingPage(){
    if (!this.landingPage.id) {
      this.landingPage.id = "1";
      this.landingPagesService.postLandingPage(this.landingPage).subscribe(landingPage=>{
        this.landingPage = landingPage;
        this.landingPage.id = this.landingPagesService.getId(this.landingPage);
      })
    }
    if (this.landingPage.id) {
      this.landingPagesService.patchLandingPage(this.landingPage).subscribe(landingPage=>{
        this.landingPage = landingPage;
        this.landingPage.id = this.landingPagesService.getId(this.landingPage);
      })
    }
    
  }
  abrirEdicion(){
    this.edicion = true;
  }
  guardarCambios(){
    this.patchLandingPage();
    this.edicion = false;
  }
  cerrarEdicion(){
    this.edicion = false;
  }
  onSelectFile(event: any) {
    this.subiendo = true;
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
    this.angularCropper.cropper.getCroppedCanvas().toBlob((blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob as Blob);
      reader.onload = () => {
        this.croppedresult = reader.result as string;
        let blobGenerado = blob as Blob;
        let imagenRecortada = new File([blobGenerado], this.imageName, { type: "image/jpeg" })
        this.imagenesService.subirImagen(imagenRecortada, this.landingPage.id, "categoria").subscribe(url => {
          console.log("URL IMG", url)
          setTimeout(() => {
            console.log("URL IMAGEN SUBIDA: ", url)
            this.imageUrl = url[0];
            this.landingPage.urlImagen = url[0];
            this.subiendo = false;
          }, 3000)
        });
      }
    }, 'image/jpeg', 0.70);
   
  }
 
}
