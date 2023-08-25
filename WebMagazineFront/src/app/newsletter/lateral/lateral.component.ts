import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Lateral } from '../models/lateral';
import { LateralServiceService } from '../service/lateral.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Publicacion } from '../models/publicacion';
import { PublicacionesServiceService } from '../service/publicaciones.service';
import { TagsServiceService } from '../service/tags.service';
import { LugaresServiceService } from '../service/lugares.service';
declare const twttr: any;

@Component({
  selector: 'app-lateral',
  templateUrl: './lateral.component.html',
  styleUrls: ['./lateral.component.css']
})
export class LateralComponent implements OnInit, OnChanges {
  @Input() publicacion: Publicacion = new Publicacion();
  lateral: Lateral = new Lateral();
  palabrasClave: string = "";
  publicacionesCerca: Publicacion[] = [];
  publicacionesRelacionadas: Publicacion[] = [];
  rol: string | null= "";
  url: string = "";

  constructor(private lateralService: LateralServiceService,
    private router: Router,
    private publicacionesService: PublicacionesServiceService,
    private tagService: TagsServiceService,
    private lugarService: LugaresServiceService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.rol = sessionStorage.getItem("rol");
    this.getUrl();
    console.log("URL: ", this.url)
    if (this.url) {
      if (this.rol == "ROLE_ADMIN" || this.rol == "ROLE_WRITER" || this.rol == "ROLE_USER_SUBSCRIBED" || this.rol == "ROLE_USER_MEMBER") {
        this.getPublicacion();
      } else {
        this.getPublicacionFree();
      }
    }
    this.getLateral();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getLateral();
  }
  /* Obtener la url del articulo */
  getUrl(): void {
    this.activatedRoute.params.subscribe(params => {
      this.url = params['titulo'];
      console.log(this.url)
    })
  }

  /* Publicacion si es un usuario suscrito */
  getPublicacion(): void {
    this.publicacionesService.getPublicacion(this.url).subscribe(publicacion => {
      publicacion.id = this.publicacionesService.getId(publicacion);
      this.publicacion = publicacion;
      this.getTagsFromPublicacion(this.publicacion);
      this.getLugarFromPublicacion(this.publicacion);
      console.log('PUBLICACION RECIBIDA EN LATERAL: ', this.publicacion)
      
    })
  }

  /* Publicación si es un usuario sin suscripción */
  getPublicacionFree() {
    this.publicacionesService.getPublicacionFree(this.url).subscribe(publicacion => {
      publicacion.id = this.publicacionesService.getId(publicacion);
      this.publicacion = publicacion;
      this.getTagsFromPublicacion(this.publicacion);
      this.getLugarFromPublicacion(this.publicacion);
     
    })
  }

  /* Tags de una publicación */
  getTagsFromPublicacion(publicacion: Publicacion) {
    this.publicacionesService.getTagsFromPublicacion(publicacion).subscribe(tags => {
      this.publicacion.tags = tags;
      this.publicacion.tags.forEach(tag => {
        tag.id = this.tagService.getId(tag);
      });
      
    })
  }

  /* Lugar de una publicación */
  getLugarFromPublicacion(publicacion: Publicacion) {
    this.publicacionesService.getLugarFromPublicacion(publicacion).subscribe(lugar => {
      this.publicacion.lugar = lugar;
      this.publicacion.lugar.id = this.lugarService.getId(lugar);
      console.log("PUBLICACION: ", this.publicacion)
    /*   this.getPublicacionesCerca(this.publicacion) */
    })
  }

  /* Sección lateral con podcast y tweets */
  getLateral() {
    this.lateralService.getLateral().subscribe(lateral => {
      this.lateral = lateral;
      this.showHtmlPodcast();
      this.getPublicacionesRelacionadas(this.publicacion);
      this.getPublicacionesCerca(this.publicacion);
    
      this.showHtmlPodcastSM();
  /*     this.showHtmlTwitter(); */
    })
  }

  /* Mostrar los 3 tweets */
/*   showHtmlTwitter() {
    for (let index = 0; index < 4; index++) {
      var twitterContainer = document.querySelector("#twitter" + index);
      var tweetContainer = document.createElement('div');
      tweetContainer.classList.add('twitter-tweet');
      tweetContainer.innerHTML = this.lateral.htmlTwitter;
      twitterContainer?.appendChild(tweetContainer);
    }
    this.loadTwitterWidgets();
  }
 */
  /* Cargar los widgets de Twitter */
/*   loadTwitterWidgets() {
    if (twttr) {
      twttr.widgets.load();
    }
  } */

  /* Mostrar el podcast */
  showHtmlPodcast() {
    var podcastContainer = document.querySelector("#podcast");
    if (podcastContainer?.children[1]) {
      if(podcastContainer?.children.length>1){
        podcastContainer?.children[1].remove();
      }
    }
    var html = document.createElement("div");
    html.innerHTML = this.lateral.htmlPodcast;
    podcastContainer?.appendChild(html);
  }
  /* Mostrar el podcast en pantallas pequeñas */
  showHtmlPodcastSM() {
    var podcastContainer = document.querySelector("#podcastSM");
    podcastContainer?.firstChild?.remove();
    var html = document.createElement("div");
    html.classList.add("podcastSM-container");
    html.classList.add("justify-content-center");
    html.innerHTML = this.lateral.htmlPodcast;
    podcastContainer?.appendChild(html);
  }

  /* Buscador */
  buscarPublicacionesPorPalabras() {
    let palabrasClaveArray = this.palabrasClave.split(" ");
    const url = `/publicaciones-buscador/?palabrasClave=${encodeURIComponent(JSON.stringify(palabrasClaveArray))}`;
    this.router.navigateByUrl(url);
  }

  /* Publicaciones con coincidencia en el lugar */
  getPublicacionesCerca(publicacion: Publicacion) {
    this.publicacionesService.getPublicacionesCerca(publicacion.lugar.lugarNombre, publicacion.id).subscribe(publicacionesCerca => {
      this.publicacionesCerca = publicacionesCerca;
      this.publicacionesCerca.forEach(publicacionCerca => {
        publicacionCerca.id = this.publicacionesService.getId(publicacionCerca);
        publicacionCerca.subtitulo = publicacionCerca.subtitulo.substring(0, 120) + "...";
        this.publicacionesService.getCategoriaFromPublicacion(publicacionCerca).subscribe(categoria => {
          publicacionCerca.categoria = categoria;
          this.publicacionesService.getAutorFromPublicacion(publicacionCerca).subscribe(autor => {
            publicacionCerca.autor = autor;
          })
        })
      });
    })
  }

  /* Publicaciones con coincidencias en las tag */
  getPublicacionesRelacionadas(publicacion: Publicacion) {
    this.publicacionesService.getPublicacionesRelacionadas(publicacion.id).subscribe(publicacionesRelacionadas => {
      this.publicacionesRelacionadas = publicacionesRelacionadas;
      this.publicacionesRelacionadas.forEach(publicacionRelacionada => {
        publicacionRelacionada.id = this.publicacionesService.getId(publicacionRelacionada);
        publicacionRelacionada.subtitulo = publicacionRelacionada.subtitulo.substring(0, 120) + "...";
        this.publicacionesService.getCategoriaFromPublicacion(publicacionRelacionada).subscribe(categoria => {
          publicacionRelacionada.categoria = categoria;
          this.publicacionesService.getAutorFromPublicacion(publicacionRelacionada).subscribe(autor => {
            publicacionRelacionada.autor = autor;
          })
        })
      });
    })
  }
}
