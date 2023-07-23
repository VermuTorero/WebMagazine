import { Component, OnInit, ViewChild } from '@angular/core';
import { PublicacionesServiceService } from '../../service/publicaciones.service';
import { Publicacion } from '../../models/publicacion';
import { ActivatedRoute } from '@angular/router';
import { Categoria } from '../../models/Categoria';
import { CategoriasServiceService } from '../../service/categorias.service';
import { CropperComponent } from 'angular-cropperjs';
import { ImagenesService } from '../../service/imagenes.service';
import { LoginService } from 'src/app/security/service/login.service';
import { Rol } from '../../models/Rol';

@Component({
  selector: 'app-publicaciones-categoria',
  templateUrl: './publicaciones-categoria.component.html',
  styleUrls: ['./publicaciones-categoria.component.css']
})
export class PublicacionesCategoriaComponent implements OnInit{
  userLogged$: any;
  isLoggedUser: any;
  isLoggedAdmin: any;
  @ViewChild('angularCropper') angularCropper: CropperComponent = new CropperComponent;
  categoria: Categoria = new Categoria();
  id: string = "";
  publicaciones: Publicacion[] = [];
  edicion: boolean = false;
  imageUrl: string = "";
  imageName: string ="";
  croppedresult: string = "";
  subiendo: boolean = false;
  pagina: number = 0;
  rol: string | null= "";


  constructor(
    private publicacionesService: PublicacionesServiceService,
    private categoriaService: CategoriasServiceService,
    private activatedRoute: ActivatedRoute,
    private imagenesService: ImagenesService,
    private loginService: LoginService) { }

  ngOnInit(): void {
    this.loginService.getIsLoggedFlagObs().subscribe((flag) => {
      this.isLoggedUser = flag;
    });
     this.loginService.getIsAdminFlagObs().subscribe((flag) => {
      this.isLoggedAdmin = flag;
    });
    this.activatedRoute.params.subscribe((params) => {
      this.categoria.categoriaNombre = params['categoria']
      this.getCategoria();
    })
    this.getPublicacionesByCategoria();
    this.rol = sessionStorage.getItem('rol');
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
    if (this.rol == "ROLE_ADMIN" || this.rol == "ROLE_WRITER" || this.rol == "ROLE_USER_SUSCRIBED" || this.rol == "ROLE_USER_MEMBER") {
    this.publicacionesService.getPublicacionesByCategoriaPagina(this.categoria.categoriaNombre, this.pagina).subscribe(publicacionesCategoria=>{
      this.publicaciones = publicacionesCategoria;
      this.publicaciones.forEach(publicacion => {
        publicacion.id = this.publicacionesService.getId(publicacion);
        this.publicacionesService.getCategoriaFromPublicacion(publicacion).subscribe(categoria=>{
          publicacion.categoria = categoria;
          this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor=>{
            publicacion.autor = autor;
          })
        })
      });
    })
  }else{
    this.publicacionesService.getPublicacionesByCategoriaFreePagina(this.categoria.categoriaNombre, this.pagina).subscribe(publicacionesCategoria=>{
      this.publicaciones = publicacionesCategoria;
      this.publicaciones.forEach(publicacion => {
        publicacion.id = this.publicacionesService.getId(publicacion);
        this.publicacionesService.getCategoriaFromPublicacion(publicacion).subscribe(categoria=>{
          publicacion.categoria = categoria;
          this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor=>{
            publicacion.autor = autor;
          })
        })
      });
    })
    }
  }

  abrirEdicion(){
    this.edicion = true;
  }

  cerrarEdicion(){
    this.subiendo = true;
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
      this.imageName = event.target.files[0].name;
    }
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
        this.imagenesService.subirImagen(imagenRecortada, this.categoria.id, "publicacion").subscribe(url => {
          this.imageUrl = url;
          this.categoria.urlImagen = url;
          this.subiendo = false;
        })
      }
    }, 'image/jpeg', 0.70)
  }

  
    /* Navegar entre páginas */
    getPaginaSiguiente(){
      this.pagina++;
      /* Para usuarios con suscripcion */
      if (this.rol == "ROLE_ADMIN" || this.rol == "ROLE_WRITER" || this.rol == "ROLE_USER_SUSCRIBED" || this.rol == "ROLE_USER_MEMBER") {
        this.publicacionesService.getPublicacionesByCategoriaPagina(this.categoria.categoriaNombre, this.pagina).subscribe(publicaciones=>{
          this.publicaciones = publicaciones;
          this.publicaciones.forEach(publicacion => {
            publicacion.id = this.publicacionesService.getId(publicacion);
            this.publicacionesService.getCategoriaFromPublicacion(publicacion).subscribe(categoria=>{
              publicacion.categoria = categoria;
              this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor=>{
                publicacion.autor = autor;
              })
            })
          });
        }, err=>{
          this.pagina--;
        })
      }else{
         /* Para usuarios sin suscripcion */
        this.publicacionesService.getPublicacionesByCategoriaFreePagina(this.categoria.categoriaNombre, this.pagina).subscribe(publicaciones=>{
          this.publicaciones = publicaciones;
          this.publicaciones.forEach(publicacion => {
            publicacion.id = this.publicacionesService.getId(publicacion);
            this.publicacionesService.getCategoriaFromPublicacion(publicacion).subscribe(categoria=>{
              publicacion.categoria = categoria;
              this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor=>{
                publicacion.autor = autor;
              })
            })
          });
        }, err=>{
          this.pagina--;
        })
      }
  
   
  
    }
  
    getPaginaAnterior(){
      /* Para usuarios con suscripcion */
      if (this.rol == "ROLE_ADMIN" || this.rol == "ROLE_WRITER" || this.rol == "ROLE_USER_SUSCRIBED" || this.rol == "ROLE_USER_MEMBER") {
        if (this.pagina>0) {
          this.pagina--;
          this.publicacionesService.getPublicacionesByCategoriaPagina(this.categoria.categoriaNombre, this.pagina).subscribe(publicaciones=>{
            this.publicaciones = publicaciones;
            this.publicaciones.forEach(publicacion => {
              publicacion.id = this.publicacionesService.getId(publicacion);
              this.publicacionesService.getCategoriaFromPublicacion(publicacion).subscribe(categoria=>{
                publicacion.categoria = categoria;
                this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor=>{
                  publicacion.autor = autor;
                })
              })
            });
          })
        }
      }else{
        /* Para usuarios sin suscripcion */
        if (this.pagina>0) {
          this.pagina--;
          this.publicacionesService.getPublicacionesByCategoriaFreePagina(this.categoria.categoriaNombre, this.pagina).subscribe(publicaciones=>{
            this.publicaciones = publicaciones;
            this.publicaciones.forEach(publicacion => {
              publicacion.id = this.publicacionesService.getId(publicacion);
              this.publicacionesService.getCategoriaFromPublicacion(publicacion).subscribe(categoria=>{
                publicacion.categoria = categoria;
                this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor=>{
                  publicacion.autor = autor;
                })
              })
            });
          })
        }
      }
      
    }
  
}
