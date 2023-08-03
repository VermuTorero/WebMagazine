import { Component, OnInit, ViewChild } from '@angular/core';
import { Publicacion } from '../../models/publicacion';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicacionesServiceService } from '../../service/publicaciones.service';
import { LugaresServiceService } from '../../service/lugares.service';
import { TagsServiceService } from '../../service/tags.service';
import { CategoriasServiceService } from '../../service/categorias.service';
import { Lateral } from '../../models/lateral';
import { LateralServiceService } from '../../service/lateral.service';
import { UsuariosService } from 'src/app/security/service/usuarios.service';
import { LikesService } from '../../service/likes.service';
import { Like } from '../../models/like';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { paypalConfig } from 'src/environments/paypalConfig';
import { ModalReceiptComponent } from 'src/app/ecommerce/components/modal-receipt/modal-receipt.component';
import { MetaService } from '../../service/meta.service';
declare const twttr: any;
declare var $: any;

@Component({
  selector: 'app-publicacion-completa',
  templateUrl: './publicacion-completa.component.html',
  styleUrls: ['./publicacion-completa.component.css']
})
export class PublicacionCompletaComponent implements OnInit {

  publicacion: Publicacion = new Publicacion();
  url: string = "";
  id: string = "";
  publicacionesCerca: Publicacion[] = [];
  publicacionesRelacionadas: Publicacion[] = [];
  fechaFormateada: string = "";
  lateral: Lateral = new Lateral();
  palabrasClave: string = "";
  rol: string | null = "";
  numeroLikes: string = "";
  keyWords: string = "";

  @ViewChild('modalVinoPaypal') modalPaypal: any;
  public payPalConfig?: IPayPalConfig;
  clientId: string = paypalConfig.clientId;


  constructor(
    private activatedRoute: ActivatedRoute,
    private publicacionesService: PublicacionesServiceService,
    private lugarService: LugaresServiceService,
    private tagService: TagsServiceService,
    private categoriaService: CategoriasServiceService,
    private router: Router,
    private lateralService: LateralServiceService,
    private usuarioService: UsuariosService,
    private likeService: LikesService,
    private modalService: NgbModal,
    private metaService: MetaService) { }

  ngOnInit(): void {
  
    this.getUrl();
    this.rol = sessionStorage.getItem("rol");
    if (this.rol == "ROLE_ADMIN" || this.rol == "ROLE_WRITER" || this.rol == "ROLE_USER_SUBSCRIBED" || this.rol == "ROLE_USER_MEMBER") {
      this.getPublicacion();
    } else {
      this.getPublicacionFree();
    }
    this.getLateral();
  }
  /* Obtener la url del articulo */
  getUrl(): void {
    this.activatedRoute.params.subscribe(params => {
      this.url = params['titulo'];
    })
  }

  /* Publicacion si es un usuario suscrito */
  getPublicacion(): void {
    this.publicacionesService.getPublicacion(this.url).subscribe(publicacion => {
      this.getFechaPublicacion(publicacion);
      publicacion.id = this.publicacionesService.getId(publicacion);
      this.getAutorFromPublicacion(publicacion);
      this.getTagsFromPublicacion(publicacion);
      this.getLugarFromPublicacion(publicacion);
      this.getCategoriaFromPublicacion(publicacion);
      this.getLikes(publicacion);
      this.publicacion = publicacion;
      this.formatoContenidoMultimedia()
      this.showPublicacion();
      this.metaService.guardarLocalStorageMetaPublicacion(this.publicacion);
      this.metaService.setMetaTagsFromLocalStorage();
    })
  }

  /* Publicación si es un usuario sin suscripción */
  getPublicacionFree() {
    this.publicacionesService.getPublicacionFree(this.url).subscribe(publicacion => {
      this.getFechaPublicacion(publicacion);
      publicacion.id = this.publicacionesService.getId(publicacion);
      this.getAutorFromPublicacion(publicacion);
      this.getTagsFromPublicacion(publicacion);
      this.getLugarFromPublicacion(publicacion);
      this.getCategoriaFromPublicacion(publicacion);
      this.getLikes(publicacion);
      this.publicacion = publicacion;
      this.formatoContenidoMultimedia()
      this.showPublicacion();
      this.metaService.guardarLocalStorageMetaPublicacion(this.publicacion);
      this.metaService.setMetaTagsFromLocalStorage();
    })
  }

  /* Fecha de una publicación */
  getFechaPublicacion(publicacion: Publicacion) {
    if (publicacion.fechaPublicacion) {
      this.fechaFormateada = publicacion.fechaPublicacion.split("T")[0];
    } else {
      this.fechaFormateada = "Sin fecha"
    }
  }

  /* Autor de una publicación */
  getAutorFromPublicacion(publicacion: Publicacion){
    this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor => {
      this.publicacion.autor = autor;
    })
  }

  /* Tags de una publicación */
  getTagsFromPublicacion(publicacion: Publicacion){
    this.publicacionesService.getTagsFromPublicacion(publicacion).subscribe(tags => {
      this.publicacion.tags = tags;
      this.publicacion.tags.forEach(tag => {
        tag.id = this.tagService.getId(tag);
      });
      this.getPublicacionesRelacionadas(publicacion);
    })
  }

  /* Lugar de una publicación */
  getLugarFromPublicacion(publicacion: Publicacion){
    this.publicacionesService.getLugarFromPublicacion(publicacion).subscribe(lugar => {
      this.publicacion.lugar = lugar;
      this.publicacion.lugar.id = this.lugarService.getId(lugar);
      this.getPublicacionesCerca(publicacion);
    })
  }

  /* Categoría de una publicación */
  getCategoriaFromPublicacion(publicacion: Publicacion){
    this.publicacionesService.getCategoriaFromPublicacion(publicacion).subscribe(categoria => {
      this.publicacion.categoria = categoria;
      this.publicacion.categoria.id = this.categoriaService.getId(categoria);
    })
  }

  /* Likes de una publicación */
  getLikes(publicacion: Publicacion) {
    this.likeService.getLikes(publicacion.id).subscribe(likes => {
      likes.forEach(like => {
        like.id = this.likeService.getId(like);
      });
      this.publicacion.likesRecibidos = likes;
      this.numeroLikes = likes.length.toString();
    })
  }

  /* Formato del contenido de la publicacion */
  formatoContenidoMultimedia() {
    /*Formato de los videos de Youtube*/
    this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<iframe class="ql-video ql-align-center" frameborder="0" allowfullscreen="true" src="https://www.youtube.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video"allowfullscreen="true" tipo="youtube" src="https://www.youtube.com');
    this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<iframe class="ql-video ql-align-center" allowfullscreen="true" src="https://www.youtube.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video" allowfullscreen="true" tipo="youtube" src="https://www.youtube.com');

    /*Formato de los podcast de Spotify*/
    this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<iframe style="border-radius:12px" src="https://open.spotify.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video ql-align-center" allowfullscreen="true" tipo="podcast" src="https://open.spotify.com');
    this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<iframe class="ql-video ql-align-center" src="https://open.spotify.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video ql-align-center" allowfullscreen="true" tipo="podcast" src="https://open.spotify.com');
    this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<iframe class="ql-video ql-align-center" allowfullscreen="true" src="https://open.spotify.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video ql-align-center" allowfullscreen="true" tipo="podcast" src="https://open.spotify.com');
    this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<iframe class="ql-video" src="https://open.spotify.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video ql-align-center" allowfullscreen="true" tipo="podcast" src="https://open.spotify.com');
    this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<iframe class="ql-video" allowfullscreen="true" src="https://open.spotify.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video ql-align-center" allowfullscreen="true" tipo="podcast" src="https://open.spotify.com');

    /* Cierre de iframe comun para Youtube y Spotify */
    this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('</iframe>', '</iframe></div>');

    /*Centrar imagenes y meterlas en un imagen-container*/
    this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<p><img', '<p class="ql-align-center imagen-container text-center"><img')
    this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<p class="ql-align-center"><img', '<p class="ql-align-center imagen-container text-center"><img')
    this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('width="100%">', 'width="100%"></p>');
    this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('width="75%">', 'width="75%"></p>');
    this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('width="50%">', 'width="50%"></p>');
    this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('width="35%">', 'width="35%"></p>');
    this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('width="20%">', 'width="20%"></p>');

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

  showPublicacion() {
    var body = document.querySelector("#article");
    var html = document.createElement("div");
    html.innerHTML = this.publicacion.htmlPublicacion;
    body?.appendChild(html)
  }

  eliminarPublicacion() {
    $('#eliminarPublicacionModal').modal('show');
  }

  eliminarPublicacionConfirmado() {
    this.publicacionesService.deletePublicacion(this.publicacion.id).subscribe(response => {
      this.router.navigate(['../../'])
    },
      err => {
        $('#errorEliminarPublicacionModal').modal('show');
        console.log("Error al eliminar: ", err)
      });
  }

  getLateral() {
    this.lateralService.getLateral().subscribe(lateral => {
      this.lateral = lateral;
      this.showHtmlPodcast();
      this.showHtmlTwitter();
      this.showHtmlPodcastSM();
      this.loadTwitterWidgets();
    })
  }

  showHtmlTwitter() {
    for (let index = 0; index < 4; index++) {
    var twitterContainer = document.querySelector("#twitter" + index);
    var tweetContainer = document.createElement('div');
    tweetContainer.classList.add('twitter-tweet');
    tweetContainer.innerHTML = this.lateral.htmlTwitter;
    twitterContainer?.appendChild(tweetContainer); 
    }
  }

  showHtmlPodcast() {
    var podcastContainer = document.querySelector("#podcast");
    var html = document.createElement("div");
    html.innerHTML = this.lateral.htmlPodcast;
    podcastContainer?.appendChild(html);
  }

  showHtmlPodcastSM() {
    var podcastContainer = document.querySelector("#podcastSM");
    var html = document.createElement("div");
    html.innerHTML = this.lateral.htmlPodcast;
    podcastContainer?.appendChild(html);
  }

  // Función para cargar los widgets de Twitter
  loadTwitterWidgets() {
    if (twttr) {
      twttr.widgets.load();
    }
  }

  buscarPublicacionesPorPalabras() {
    let palabrasClaveArray = this.palabrasClave.split(" ");
    const url = `/publicaciones-buscador/?palabrasClave=${encodeURIComponent(JSON.stringify(palabrasClaveArray))}`;
    this.router.navigateByUrl(url);
  }

  like() {
    this.usuarioService.getUsuarioFromToken().subscribe(usuario => {
      usuario.id = this.usuarioService.getId(usuario);
      let like = new Like();
      like.usuario = usuario;
      this.likeService.postLike(this.publicacion.id, usuario).subscribe(like => {
        this.getLikes(this.publicacion);
      });
    })
  }

  invitarVino() {
    this.pagar("3");
  }

  pagar(precio: string): void {
    this.modalService.open(this.modalPaypal, {
      size: 'm',
      windowClass: 'modalVinoPaypal'
    });
    this.initConfig(precio);
  }

  // metodo paypal
  private initConfig(precio: string): void {
    this.payPalConfig = {
      currency: 'EUR',
      //colocar id de la pagina paypal developer, en proyecto meter variable en enviroment
      clientId: this.clientId,
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                //en que moneda lo queremos mirar doc de paypal
                currency_code: 'EUR',
                //colocamos el valor total de los items del carro en string
                value: precio,
                breakdown: {
                  item_total: {
                    currency_code: 'EUR',
                    value: precio,
                  },
                },
              },
              // colocamos los items del carrito con el metodo getItemsList
              items: [{ name: "suscripcion", quantity: "1", unit_amount: { value: precio, currency_code: 'EUR' } }],
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        console.log(
          'onApprove - transaction was approved, but not authorized',
          data,
          actions
        );
        actions.order.get().then((details: any) => {
          console.log(
            'onApprove - you can get full order details inside onApprove: ',
            details
          );
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          'onClientAuthorization - you should probably inform your server about completed transaction at this point',
          data
        );
        this.modalService.dismissAll();
        $('#pagadoVinoModal').modal('show');
      },
      onCancel: (data, actions) => {
        this.modalService.dismissAll();
        $('#errorPagoModal').modal('show');
        console.log('OnCancel', data, actions);
      },
      onError: (err) => {
        this.modalService.dismissAll();
        $('#errorPagoModal').modal('show');
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  openModal(items: any, amount: any): void {
    const modalRef = this.modalService.open(ModalReceiptComponent, { size: 'lg' });
    modalRef.componentInstance.items = items;
    modalRef.componentInstance.amount = amount
  }
}
