import { Component, OnInit, ViewChild } from '@angular/core';
import { PublicacionesServiceService } from '../../service/publicaciones.service';
import { Publicacion } from '../../models/publicacion';
import { ActivatedRoute } from '@angular/router';
import { Categoria } from '../../models/Categoria';
import { CategoriasServiceService } from '../../service/categorias.service';
import { CropperComponent } from 'angular-cropperjs';
import { ImagenesService } from '../../service/imagenes.service';

@Component({
  selector: 'app-publicaciones-categoria',
  templateUrl: './publicaciones-categoria.component.html',
  styleUrls: ['./publicaciones-categoria.component.css']
})
export class PublicacionesCategoriaComponent implements OnInit{
  @ViewChild('angularCropper') angularCropper: CropperComponent = new CropperComponent;
  categoria: Categoria = new Categoria();
  id: string = "";
  publicaciones: Publicacion[] = [];
  edicion: boolean = false;
  imageUrl: string = "";
  imageName: string ="";
  croppedresult: string = "";
  subiendo: boolean = false;


  constructor(
    private publicacionesService: PublicacionesServiceService,
    private categoriaService: CategoriasServiceService,
    private activatedRoute: ActivatedRoute,
    private imagenesService: ImagenesService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.categoria.categoriaNombre = params['categoria']
      this.getCategoria();
      console.log("PROVINCIA RECIBIDA:", this.categoria)
    })
    this.getPublicacionesByCategoria();
  }
  getCategoria(){
    this.categoria.categoriaNombre = this.categoria.categoriaNombre.replaceAll("-", " ");
    this.categoriaService.getCategoriaByCategoriaNombre(this.categoria.categoriaNombre).subscribe(categoria=>{
      this.categoria = categoria;
      this.categoria.id = this.categoriaService.getId(this.categoria);
      this.imageUrl = this.categoria.urlImagen;
      this.imageName = this.categoria.categoriaNombre;
    })
  }

  getPublicacionesByCategoria(){
    this.publicacionesService.getPublicacionesByCategoria(this.categoria.categoriaNombre).subscribe(publicacionesCategoria=>{
      this.publicaciones = publicacionesCategoria;
      this.publicaciones.forEach(publicacion => {
        publicacion.id = this.publicacionesService.getId(publicacion);
      });
    })
  }

  abrirEdicion(){
    this.edicion = true;
  }

  cerrarEdicion(){
    this.subiendo = true;
    console.log("URL en categoria: ", this.imageUrl)
    this.categoria.urlImagen = this.imageUrl;
    this.categoriaService.patchCategoria(this.categoria).subscribe(categoria=>{
      this.categoria = categoria;
      this.categoria.id = this.categoriaService.getId(this.categoria);
      this.getCategoria();
    })
    this.edicion = false;
    this.subiendo = false;
  }
  cancelarEdicion(){
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
        this.imagenesService.subirImagen(imagenRecortada, this.categoria.id, "categoria").subscribe(url => {
          console.log("URL IMG", url)
          setTimeout(() => {
            console.log("URL IMAGEN SUBIDA: ", url)
            this.imageUrl = url[0];
            this.categoria.urlImagen = url[0];
            this.subiendo = false;
          }, 3000)
        });
      }
    }, 'image/jpeg', 0.70);
   
  }
}
