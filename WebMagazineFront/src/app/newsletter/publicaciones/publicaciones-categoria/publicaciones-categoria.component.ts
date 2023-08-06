import { Component, OnInit, ViewChild } from '@angular/core';
import { PublicacionesServiceService } from '../../service/publicaciones.service';
import { Publicacion } from '../../models/publicacion';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from '../../models/Categoria';
import { CategoriasServiceService } from '../../service/categorias.service';
import { CropperComponent } from 'angular-cropperjs';
import { ImagenesService } from '../../service/imagenes.service';
import { LoginService } from 'src/app/security/service/login.service';
import { TagsServiceService } from '../../service/tags.service';
import { LugaresServiceService } from '../../service/lugares.service';
import { LikesService } from '../../service/likes.service';

@Component({
  selector: 'app-publicaciones-categoria',
  templateUrl: './publicaciones-categoria.component.html',
  styleUrls: ['./publicaciones-categoria.component.css']
})
export class PublicacionesCategoriaComponent implements OnInit {
  userLogged$: any;
  isLoggedUser: any;
  isLoggedAdmin: any;
  @ViewChild('angularCropper') angularCropper: CropperComponent = new CropperComponent;
  categoria: Categoria = new Categoria();
  id: string = "";
  publicaciones: Publicacion[] = [];
  edicion: boolean = false;
  imageUrl: string = "";
  imageName: string = "";
  croppedresult: string = "";
  subiendo: boolean = false;
  pagina: number = 0;
  rol: string | null = "";
  publicacionesRestauranteFila1: Publicacion[] = [];
  publicacionesRestauranteFila2: Publicacion[] = [];
  publicacionesRestauranteFila3: Publicacion[] = [];
  publicacionSeleccionada: Publicacion = new Publicacion();
  activeCard: number = -1; // Inicialmente, no hay ninguna card activa
  publicacionesDestacadas: Publicacion[] = [];
  palabrasClave: string = "";

  constructor(
    private publicacionesService: PublicacionesServiceService,
    private categoriaService: CategoriasServiceService,
    private activatedRoute: ActivatedRoute,
    private imagenesService: ImagenesService,
    private loginService: LoginService, 
    private tagsService: TagsServiceService,
    private lugarService: LugaresServiceService,
    private likesService: LikesService,
    private router: Router) { }

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
    this.rol = sessionStorage.getItem('rol');
    this.getPublicacionesByCategoria();
  }

  getCategoria() {
    this.categoria.categoriaNombre = this.categoria.categoriaNombre.replaceAll("-", " ");
    this.categoriaService.getCategoriaByCategoriaNombre(this.categoria.categoriaNombre).subscribe(categoria => {
      this.categoria = categoria;
      this.categoria.id = this.categoriaService.getId(this.categoria);
      this.imageUrl = this.categoria.urlImagen;
      this.imageName = this.categoria.categoriaNombre;
    });
  }

 
  getPublicacionesByCategoria() {
    /* Si es un usuario ADMIN, WRITER o con suscripcion */
    if (this.rol == "ROLE_ADMIN" || this.rol == "ROLE_WRITER" || this.rol == "ROLE_USER_SUSCRIBED" || this.rol == "ROLE_USER_MEMBER") {
      this.publicacionesService.getPublicacionesByCategoriaPagina(this.categoria.categoriaNombre, this.pagina).subscribe(publicacionesCategoria => {
        this.publicaciones = publicacionesCategoria;
        this.publicaciones.forEach(publicacion => {
          publicacion.id = this.publicacionesService.getId(publicacion);
          this.publicacionesService.getCategoriaFromPublicacion(publicacion).subscribe(categoria => {
            publicacion.categoria = categoria;
            this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor => {
              publicacion.autor = autor;
              this.publicacionesService.getTagsFromPublicacion(publicacion).subscribe(tags=>{
                tags.forEach(tag => {
                  tag.id = this.tagsService.getId(tag);
                });
                publicacion.tags = tags;
                this.publicacionesService.getLugarFromPublicacion(publicacion).subscribe(lugar=>{
                  lugar.id = this.lugarService.getId(lugar);
                  publicacion.lugar = lugar;
                  this.likesService.getLikes(publicacion.id).subscribe(likes=>{
                    publicacion.likesRecibidos = likes;
                    publicacion = this.formatoContenidoMultimedia(publicacion);
                  })
                })
              });
            })
          })
        });
        if (this.categoria.categoriaNombre=="Restaurantes") {
          this.agruparElementosPorFilas(this.publicaciones);
        }
        if (this.categoria.categoriaNombre=="Entrevidas" || this.categoria.categoriaNombre=="Patata Santa"
         || this.categoria.categoriaNombre=="Bares" || this.categoria.categoriaNombre=="Mercados") {
          this.publicacionSeleccionada = this.publicaciones[0];
          this.activeCard = 0;
        }
      })
    } else {
      /* Si es un usuario sin suscripcion */
      this.publicacionesService.getPublicacionesByCategoriaFreePagina(this.categoria.categoriaNombre, this.pagina).subscribe(publicacionesCategoria => {
        this.publicaciones = publicacionesCategoria;
        this.publicaciones.forEach(publicacion => {
          publicacion.id = this.publicacionesService.getId(publicacion);
          this.publicacionesService.getCategoriaFromPublicacion(publicacion).subscribe(categoria => {
            publicacion.categoria = categoria;
            this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor => {
              publicacion.autor = autor;
              this.publicacionesService.getTagsFromPublicacion(publicacion).subscribe(tags=>{
                tags.forEach(tag => {
                  tag.id = this.tagsService.getId(tag);
                });
                publicacion.tags = tags;
                this.publicacionesService.getLugarFromPublicacion(publicacion).subscribe(lugar=>{
                  lugar.id = this.lugarService.getId(lugar);
                  publicacion.lugar = lugar;
                  this.likesService.getLikes(publicacion.id).subscribe(likes=>{
                    publicacion.likesRecibidos = likes;
                    publicacion = this.formatoContenidoMultimedia(publicacion);
                  })
                  
                })
              })
            })
          })
        });
        if (this.categoria.categoriaNombre=="Restaurantes") {
          this.agruparElementosPorFilas(this.publicaciones);
        }
        if (this.categoria.categoriaNombre=="Entrevidas" || this.categoria.categoriaNombre=="Patata Santa"
         || this.categoria.categoriaNombre=="Bares" || this.categoria.categoriaNombre=="Mercados") {
          this.publicacionSeleccionada = this.publicaciones[0];
          this.activeCard = 0;
        }
      })
    }
  }

  /* Formato del contenido de la publicacion */
  formatoContenidoMultimedia(publicacion: Publicacion): Publicacion {
    /*Formato de los videos de Youtube*/
    publicacion.htmlPublicacion = publicacion.htmlPublicacion.replaceAll('<iframe class="ql-video ql-align-center" frameborder="0" allowfullscreen="true" src="https://www.youtube.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video"allowfullscreen="true" tipo="youtube" src="https://www.youtube.com');
    publicacion.htmlPublicacion = publicacion.htmlPublicacion.replaceAll('<iframe class="ql-video ql-align-center" allowfullscreen="true" src="https://www.youtube.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video" allowfullscreen="true" tipo="youtube" src="https://www.youtube.com');

    /*Formato de los podcast de Spotify*/
    publicacion.htmlPublicacion = publicacion.htmlPublicacion.replaceAll('<iframe style="border-radius:12px" src="https://open.spotify.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video ql-align-center" allowfullscreen="true" tipo="podcast" src="https://open.spotify.com');
    publicacion.htmlPublicacion = publicacion.htmlPublicacion.replaceAll('<iframe class="ql-video ql-align-center" src="https://open.spotify.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video ql-align-center" allowfullscreen="true" tipo="podcast" src="https://open.spotify.com');
    publicacion.htmlPublicacion = publicacion.htmlPublicacion.replaceAll('<iframe class="ql-video ql-align-center" allowfullscreen="true" src="https://open.spotify.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video ql-align-center" allowfullscreen="true" tipo="podcast" src="https://open.spotify.com');
    publicacion.htmlPublicacion = publicacion.htmlPublicacion.replaceAll('<iframe class="ql-video" src="https://open.spotify.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video ql-align-center" allowfullscreen="true" tipo="podcast" src="https://open.spotify.com');
    publicacion.htmlPublicacion = publicacion.htmlPublicacion.replaceAll('<iframe class="ql-video" allowfullscreen="true" src="https://open.spotify.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video ql-align-center" allowfullscreen="true" tipo="podcast" src="https://open.spotify.com');

    /* Cierre de iframe comun para Youtube y Spotify */
    publicacion.htmlPublicacion = publicacion.htmlPublicacion.replaceAll('</iframe>', '</iframe></div>');

    /*Centrar imagenes y meterlas en un imagen-container*/
    publicacion.htmlPublicacion = publicacion.htmlPublicacion.replaceAll('<p><img', '<p class="ql-align-center imagen-container text-center"><img')
    publicacion.htmlPublicacion = publicacion.htmlPublicacion.replaceAll('<p class="ql-align-center"><img', '<p class="ql-align-center imagen-container text-center"><img')
    publicacion.htmlPublicacion = publicacion.htmlPublicacion.replaceAll('width="100%">', 'width="100%"></p>');
    publicacion.htmlPublicacion = publicacion.htmlPublicacion.replaceAll('width="75%">', 'width="75%"></p>');
    publicacion.htmlPublicacion = publicacion.htmlPublicacion.replaceAll('width="50%">', 'width="50%"></p>');
    publicacion.htmlPublicacion = publicacion.htmlPublicacion.replaceAll('width="35%">', 'width="35%"></p>');
    publicacion.htmlPublicacion = publicacion.htmlPublicacion.replaceAll('width="20%">', 'width="20%"></p>');

    return publicacion;
  }

  abrirEdicion() {
    this.edicion = true;
  }

  cerrarEdicion() {
    this.subiendo = true;
    this.categoria.urlImagen = this.imageUrl;
    this.categoriaService.patchCategoria(this.categoria).subscribe(categoria => {
      this.categoria = categoria;
      this.categoria.id = this.categoriaService.getId(this.categoria);
      this.getCategoria();
    })
    this.edicion = false;
    this.subiendo = false;
  }
  cancelarEdicion() {
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
  getPaginaSiguiente() {
    this.pagina++;
    /* Para usuarios con suscripcion */
    if (this.rol == "ROLE_ADMIN" || this.rol == "ROLE_WRITER" || this.rol == "ROLE_USER_SUSCRIBED" || this.rol == "ROLE_USER_MEMBER") {
      this.publicacionesService.getPublicacionesByCategoriaPagina(this.categoria.categoriaNombre, this.pagina).subscribe(publicaciones => {
        this.publicaciones.forEach(publicacion => {
          publicacion.id = this.publicacionesService.getId(publicacion);
          this.publicacionesService.getCategoriaFromPublicacion(publicacion).subscribe(categoria => {
            publicacion.categoria = categoria;
            this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor => {
              publicacion.autor = autor;
            })
          })
        });
      }, err => {
        this.pagina--;
      })
    } else {
      /* Para usuarios sin suscripcion */
      this.publicacionesService.getPublicacionesByCategoriaFreePagina(this.categoria.categoriaNombre, this.pagina).subscribe(publicaciones => {
        if (publicaciones) {
          this.publicaciones = publicaciones;
          this.publicaciones.forEach(publicacion => {
            publicacion.id = this.publicacionesService.getId(publicacion);
            this.publicacionesService.getCategoriaFromPublicacion(publicacion).subscribe(categoria => {
              publicacion.categoria = categoria;
              this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor => {
                publicacion.autor = autor;
              })
            })
          });
        }
      
      }, err => {
        this.pagina--;
      })
    }
  }

  getPaginaAnterior() {
    /* Para usuarios con suscripcion */
    if (this.rol == "ROLE_ADMIN" || this.rol == "ROLE_WRITER" || this.rol == "ROLE_USER_SUSCRIBED" || this.rol == "ROLE_USER_MEMBER") {
      if (this.pagina > 0) {
        this.pagina--;
        this.publicacionesService.getPublicacionesByCategoriaPagina(this.categoria.categoriaNombre, this.pagina).subscribe(publicaciones => {
          this.publicaciones = publicaciones;
          this.publicaciones.forEach(publicacion => {
            publicacion.id = this.publicacionesService.getId(publicacion);
            this.publicacionesService.getCategoriaFromPublicacion(publicacion).subscribe(categoria => {
              publicacion.categoria = categoria;
              this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor => {
                publicacion.autor = autor;
              })
            })
          });
        })
      }
    } else {
      /* Para usuarios sin suscripcion */
      if (this.pagina > 0) {
        this.pagina--;
        this.publicacionesService.getPublicacionesByCategoriaFreePagina(this.categoria.categoriaNombre, this.pagina).subscribe(publicaciones => {
          this.publicaciones = publicaciones;
          this.publicaciones.forEach(publicacion => {
            publicacion.id = this.publicacionesService.getId(publicacion);
            this.publicacionesService.getCategoriaFromPublicacion(publicacion).subscribe(categoria => {
              publicacion.categoria = categoria;
              this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor => {
                publicacion.autor = autor;
              })
            })
          });
        })
      }
    }
  }
  // En el componente correspondiente (por ejemplo, app.component.ts)
  agruparElementosPorFilas(elementos: any[]) {
    for (let index = 0; index < this.publicaciones.length; index++) {
      if (index < 3) {
        this.publicacionesRestauranteFila1.push(this.publicaciones[index])
      }
      if (index === 3 || index === 4) {
        this.publicacionesRestauranteFila2.push(this.publicaciones[index])
      }
      if (index > 4) {
        this.publicacionesRestauranteFila3.push(this.publicaciones[index])
      }

    }
  }
  abrirPublicacionEntrevidas(publicacion: any){
    this.publicacionSeleccionada = this.formatoContenidoMultimedia(publicacion);
  }

  onClickCard(index: number) {
    this.activeCard = index;
  }
    /* Buscador */
    buscarPublicacionesPorPalabras() {
      let palabrasClaveArray = this.palabrasClave.split(" ");
      const url = `/publicaciones-buscador/?palabrasClave=${encodeURIComponent(JSON.stringify(palabrasClaveArray))}`;
      this.router.navigateByUrl(url);
    }
}
