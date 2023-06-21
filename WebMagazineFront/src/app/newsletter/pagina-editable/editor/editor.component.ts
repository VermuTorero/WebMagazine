import { Component, OnInit, ViewChild } from '@angular/core';
import { CropperComponent } from 'angular-cropperjs';
import { PaginaEditable } from '../../models/PaginaEditable';
import { PaginaEditableService } from '../../service/paginaEditable.service';
import { ImagenesService } from '../../service/imagenes.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  @ViewChild('angularCropper') angularCropper: CropperComponent = new CropperComponent;

  paginaEditable: PaginaEditable = new PaginaEditable();
    /* Variables para agregar contenido al editor Quill */
    texto: string = "";
    urlImagen: string = "";
    urlVideo: string = "";
    htmlPodcast: string = "";
    htmlVideo: string = "";
      /* Recortador de imagenes */
  imageUrl: string = "";
  imagePreviewUrl = "";
  imageName: string = "";
  croppedresult = "";
  anchoImagen: string = "100";
  nombrePagina: string = "";

  constructor(private paginaEditableService: PaginaEditableService,
    private imagenesService: ImagenesService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.getNombrePagina();
    this.getPaginaEditable();
    this.ajustarEditor();
  
  }

  getNombrePagina(): void {
    this.activatedRoute.params.subscribe(params => {
      console.log(params)
      this.nombrePagina = params['paginaNombre'].replaceAll("-", " ");
    })
  }

  getPaginaEditable() {
    this.paginaEditableService.getPaginaEditable(this.nombrePagina).subscribe(paginaEditable => {
      paginaEditable.id = this.paginaEditableService.getId(paginaEditable);
      this.paginaEditable = paginaEditable;
      this.paginaEditable.html= this.paginaEditable.html.replaceAll('width="100%" height="352"', 'width="80%" height="200"');
      this.texto = paginaEditable.html;
      
    })
  }

  enviar(){
    if (this.paginaEditable.id) {
      this.patchPaginaEditable();
    }else{
      this.postPaginaEditable();
    }
  }
  postPaginaEditable(){
    this.paginaEditable.id = undefined;
    this.paginaEditable.html = this.texto;
    this.paginaEditable.nombrePagina = this.nombrePagina.replaceAll("-", " ");
    this.paginaEditableService.postPaginaEditable(this.paginaEditable).subscribe(paginaEditable=>{
      paginaEditable.id = this.paginaEditableService.getId(paginaEditable);
      this.paginaEditable = paginaEditable;
    })
  }

  patchPaginaEditable(){
    this.paginaEditable.html = this.texto;
    this.paginaEditable.nombrePagina = this.nombrePagina.replaceAll("-", " ");
    this.paginaEditableService.patchPaginaEditable(this.paginaEditable).subscribe(paginaEditable=>{
      paginaEditable.id = this.paginaEditableService.getId(paginaEditable);
      this.paginaEditable = paginaEditable;
    })
  }

  agregarPodcast() {
    this.htmlPodcast = this.htmlPodcast.replace('></iframe>', 'tipo ="podcast"></iframe>');
    this.htmlPodcast= this.htmlPodcast.replaceAll('width="100%" height="352"', 'width="80%" height="200"');
    this.texto = this.texto + this.htmlPodcast;

  }

  agregarVideo() {
    this.htmlVideo = this.htmlVideo.replace('></iframe>', 'tipo ="youtube"></iframe>');
    this.texto = this.texto + this.htmlVideo;
    this.htmlVideo = "";
  }
  
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
        this.imagenesService.subirImagen(imagenRecortada, "pagina-editable", "pagina-editable").subscribe(url => {
          console.log("URL IMAGEN SUBIDA: ", url)
          this.insertarImagenUrl(url);
        })
      }
    }, 'image/jpeg', 0.70)
  }

  insertarImagenUrl(urlImagen: string) {
    this.texto = this.texto + '<img src="' + urlImagen + '" alt="imagenAlt' + this.anchoImagen + '">'
    urlImagen = "";
    this.imageUrl = "";
    this.imageName = "";
  }

  ajustarEditor() {
    setTimeout(() => {
      var quilEditor = document
        .getElementsByClassName('ql-editor')[0];
      quilEditor.setAttribute("style", "height: 700px")
    }, 500);
  }
}
