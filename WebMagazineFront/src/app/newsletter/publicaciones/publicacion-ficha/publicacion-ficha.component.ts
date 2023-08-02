import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Publicacion } from '../../models/publicacion';
import { ActivatedRoute, ParamMap, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { PublicacionesServiceService } from '../../service/publicaciones.service';
import Quill from 'quill';
import { Tag } from '../../models/Tag';
import { environment } from 'src/environments/environment';
import { TagsServiceService } from '../../service/tags.service';
import { saveAs } from 'file-saver';
import { CropperComponent } from 'angular-cropperjs';
import { ImagenesService } from '../../service/imagenes.service';
import { Lugar } from '../../models/Lugar';
import { CategoriasServiceService } from '../../service/categorias.service';
declare var $: any;
import { Categoria } from '../../models/Categoria';
import { LugaresServiceService } from '../../service/lugares.service';
import { UsuariosService } from 'src/app/security/service/usuarios.service';
import { Usuario } from 'src/app/security/models/usuario';
import { LikesService } from '../../service/likes.service';
import { SeoService } from '../../service/seo.service';


@Component({
  selector: 'app-publicacion-ficha',
  templateUrl: './publicacion-ficha.component.html',
  styleUrls: ['./publicacion-ficha.component.css']
})

export class PublicacionFichaComponent implements OnInit {
  @ViewChild('angularCropper') angularCropper: CropperComponent = new CropperComponent;
  @ViewChild('angularCropper2') angularCropper2: CropperComponent = new CropperComponent;
  id: string = "";
  publicacion: Publicacion = new Publicacion();
  /* Variables para agregar contenido al editor Quill */
  texto: string = "";
  urlImagen: string = "";
  urlVideo: string = "";
  htmlPodcast: string = "";
  htmlVideo: string = "";
  /* Fecha de la publicacion formateada */
  fechaPublicacion: string = "";
  /* Endpoints */
  endpointTags: string = environment.urlAPI + "/tags/";
  endpointAutores: string = environment.urlAPI + "/autores/";
  endpointCategorias: string = environment.urlAPI + "/categorias/";
  /* Recortador de imagenes */
  imageUrl: string = "";
  imagePreviewUrl = "";
  imageName: string = "";
  croppedresult = "";
  anchoImagen: string = "100";
  nombreImagen: string = ""
  /* Tipos para las opciones del formulario */
  lugares: Lugar[] = [];
  categorias: Categoria[] = [];
  tags: Tag[] = [];
  tagNueva: Tag = new Tag();
  autores: Usuario[] = [];

  /* Selecciones en el formulario */
  tagsSeleccionadas: Tag[] = [];
  tagSeleccionada: Tag = new Tag();
  lugarSeleccionado: Lugar = new Lugar();
  categoriaSeleccionada: Categoria = new Categoria();

  /* Conteo de palabras */
  palabrasTitulo: number = 0;
  palabrasDescripcion: number = 0;

  /* Likes */
  numeroLikes: string = "";

  /* Importador */
  htmlWordPress: string = "";
  htmlVermuTorero: string = "";
  fechaArticuloImportado: string = "";

  /* Variables de TIP SEO */
  palabrasRepetidasTitulo: string | null = "";
  titulosH3: boolean = false;
  titulosH2: boolean = false;
  titulosH1: boolean = false;
  enlaces: boolean = false;
  numeroEnlaces: number = 0;
  imgs: boolean = false;
  numeroImgs: number = 0;
  srcImgs: boolean = false;
  urlValida: boolean = true;
  keyWords: string[] = [];
  caracteresTitulo: number = 0;

  quill: Quill = new Quill('#editor', {
    theme: 'snow',
    scrollingContainer: '#scrolling-container',
  });

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private publicacionesService: PublicacionesServiceService,
    private tagsService: TagsServiceService,
    private usuariosService: UsuariosService,
    private imagenesService: ImagenesService,
    private categoriasService: CategoriasServiceService,
    private lugaresService: LugaresServiceService,
    private likeService: LikesService,
    private seoService: SeoService
  ) { }

  ngOnInit(): void {
    this.publicacion.autor = new Usuario();
    this.publicacion.categoria = new Categoria();
    this.getTags();
    this.getAutores();
    this.getCategorias();
    this.getLugares();
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id']
      if (this.id) {
        this.getPublicacion();
      }
      this.ajustarEditor();
    })
    this.autoGuardado();
  }

  ajustarEditor() {
    setTimeout(() => {
      var quilEditor = document
        .getElementsByClassName('ql-editor')[0];
      quilEditor.setAttribute("style", "height: 700px")
    }, 500);
  }

  /* Obtener el id de la publicacion de la url */
  getId(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id']
    })
  }

  getPublicacion() {
    this.publicacionesService.getPublicacionById(this.id).subscribe(publicacion => {
      this.publicacion = publicacion;
      this.publicacion.id = this.id;
      this.imagePreviewUrl = this.publicacion.imagenPreviewUrl;
      this.getAutorPublicacion();
      this.getLugarPublicacion();
      this.getCategoriaPublicacion();
      this.getTagsPublicacion();
      this.getFechaPublicacion();
      this.getLikes(publicacion);
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('width="100%" height="352"', 'width="80%" height="200"');
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('width="560" height="315"', 'width="90%" height="auto"');
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<p><img', '<p class="ql-align-center imagen-container text-center"><img')
      this.texto = this.publicacion.htmlPublicacion;
      this.analizarTitulo();
      this.analizarTexto();
    })
  }

  publicarNueva() {
    this.publicacion.publicado = true;
    this.postPublicacion();
  }

  publicarModificada() {
    this.publicacion.publicado = true;
    this.patchPublicacion();
  }

  guardarBorradorNuevo() {
    this.publicacion.publicado = false;
    this.postPublicacion();
  }

  guardarBorradorModificado() {
    this.publicacion.publicado = false;
    this.patchPublicacion();
  }

  postPublicacion() {
    if (this.verificarCamposObligatorios()) {
      this.setFecha();
      this.publicacion.htmlPublicacion = this.texto;
      this.publicacion.tags = [];
      this.tagsSeleccionadas.forEach(tag => {
        this.publicacion.tags.push(tag)
      });
      this.descargarTxt();
      this.publicacion.url = this.seoService.generarUrl(this.publicacion.titulo);

      this.publicacionesService.postPublicacion(this.publicacion).subscribe(publicacion => {
        this.getPublicacion();
        this.descargarTxt();
        $('#enviadoModal').modal('show');
        this.router.navigate(["/../../publicaciones/" + this.publicacion.url])
      });
    } else {
      $('#errorModal').modal('show');
    }
  }

  postPublicacionAutoguardado() {
    if (this.verificarCamposObligatorios()) {
      this.setFecha();
      this.publicacion.htmlPublicacion = this.texto;
      this.publicacion.tags = [];
      this.tagsSeleccionadas.forEach(tag => {
        this.publicacion.tags.push(tag)
      });
      this.publicacion.url = this.seoService.generarUrl(this.publicacion.titulo);
      this.publicacionesService.postPublicacion(this.publicacion).subscribe(publicacion => {
      });
    }
  }

  setFecha() {
    if (this.fechaArticuloImportado) {
      this.publicacion.fechaPublicacion = this.fechaArticuloImportado + "T00:00:00.000Z";
    } else {
      const fechaActual = new Date();
      const year = fechaActual.getFullYear();
      const month = String(fechaActual.getMonth() + 1).padStart(2, '0');
      const day = String(fechaActual.getDate()).padStart(2, '0');

      this.publicacion.fechaPublicacion = year + "-" + month + "-" + day + "T00:00:00.000Z";
    }
  }

  verificarCamposObligatorios(): boolean {
    if (this.publicacion.titulo != "" && this.publicacion.autor.id != ""
      && this.publicacion.lugar.id != "" && this.publicacion.categoria.id != ""
      && this.publicacion.imagenPreviewUrl != "" && this.publicacion.subtitulo != ""
      && this.texto != "" && this.seoService.validarURL(this.publicacion.titulo)) {
      return true;
    } else {
      return false;
    }
  }

  patchPublicacion() {
    if (this.fechaArticuloImportado) {
      this.publicacion.fechaPublicacion = this.fechaArticuloImportado + "T00:00:00.000Z";
    }
    this.publicacion.htmlPublicacion = this.texto;
    this.publicacion.tags = [];
    this.publicacion.tags = this.tagsSeleccionadas;
    this.publicacion.url = this.seoService.generarUrl(this.publicacion.titulo);
    if (this.verificarCamposObligatorios()) {
      this.publicacionesService.patchPublicacion(this.publicacion).subscribe(publicacionModicada => {
        this.getPublicacion();
        this.descargarTxt();
        this.router.navigate(["/../../publicaciones/" + publicacionModicada.url]);
      })
    } else {
      $('#errorModal').modal('show');
    }


  }

  patchPublicacionAutoguardado() {
    if (this.fechaArticuloImportado) {
      this.publicacion.fechaPublicacion = this.fechaArticuloImportado + "T00:00:00.000Z";
    }
    this.publicacion.htmlPublicacion = this.texto;
    this.publicacion.tags = [];
    this.publicacion.tags = this.tagsSeleccionadas;
    this.publicacion.url = this.seoService.generarUrl(this.publicacion.titulo);
    this.publicacionesService.patchPublicacion(this.publicacion).subscribe(publicacionModicada => {
    })
  }

  descargarTxt() {
    let publicacion = JSON.stringify(this.publicacion);
    var blob = new Blob([publicacion], { type: "text/plain;charset=utf-8" });
    saveAs(blob, this.publicacion.titulo + ".txt");
  }


  //TAGS

  getTags(): void {
    this.tagsService.getTags().subscribe(tags => {
      this.tags = tags;
      this.tags.forEach(tag => {
        tag.id = this.tagsService.getId(tag);
      });
    });
  }

  agregarTag() {
    this.tags.forEach(tag => {
      if (tag.id == this.tagSeleccionada.id) {
        this.tagSeleccionada.tagNombre = tag.tagNombre;
      }
    });
    this.tagsSeleccionadas.push(this.tagSeleccionada);
    console.log("TAGS SELECCIONADAS", this.tagsSeleccionadas)
    this.tagSeleccionada = new Tag();
  }

  eliminarTag(id: string) {
    for (let index = 0; index < this.tagsSeleccionadas.length; index++) {
      if (this.tagsSeleccionadas[index].id == id) {
        this.tagsSeleccionadas.splice(index, 1);
      }
    }
    console.log("TAGS SEL DESP BORRAR", this.tagsSeleccionadas)
  }

  nuevaTag() {
    this.tagsService.postTag(this.tagNueva).subscribe(tag => {
      tag.id = this.tagsService.getId(tag);
      this.getTags();
      this.tagSeleccionada.id = tag.id;
      this.tagSeleccionada.tagNombre = tag.tagNombre;
      this.agregarTag();
    });
  }

  getTagsPublicacion() {
    this.publicacionesService.getTagsFromPublicacion(this.publicacion).subscribe(tagsPublicacion => {
      tagsPublicacion.forEach(tagPublicacion => {
        tagPublicacion.id = this.tagsService.getId(tagPublicacion);
      });
      this.publicacion.tags = tagsPublicacion;
      console.log("TAGS PUBLICACION:", this.publicacion.tags)
      this.tagsSeleccionadas = tagsPublicacion;
    })
  }

  //AUTOR
  getAutores(): void {
    this.usuariosService.getAutores().subscribe(autores => {
      console.log(autores)
      this.autores = autores;
      this.autores.forEach(autor => {
        autor.id = this.usuariosService.getId(autor);
      });
      console.log("AUTORES CON ID:", this.autores)
    });
  }

  getAutorPublicacion() {
    this.publicacionesService.getAutorFromPublicacion(this.publicacion).subscribe(autorPublicacion => {
      autorPublicacion.id = this.usuariosService.getId(autorPublicacion)
      console.log("AUTOR PUBLICACION:", autorPublicacion)
      this.publicacion.autor = autorPublicacion;

    })
  }

  //CATEGORIA
  getCategorias() {
    this.categoriasService.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
      this.categorias.forEach(categoria => {
        categoria.id = this.categoriasService.getId(categoria);
      });
      console.log("CATEGORIAS RECIBIDAS: ", this.categorias)
    })
  }

  getCategoriaPublicacion() {
    this.publicacionesService.getCategoriaFromPublicacion(this.publicacion).subscribe(categoria => {
      categoria.id = this.categoriasService.getId(categoria);
      console.log("CATEG: ", categoria)
      this.publicacion.categoria = categoria;
      this.categoriaSeleccionada = categoria;

    })
  }

  getFechaPublicacion() {
    if (this.publicacion.fechaPublicacion) {
      this.fechaPublicacion = this.publicacion.fechaPublicacion.split("T")[0];
    }
  }

  //LUGAR
  getLugares() {
    this.lugaresService.getLugares().subscribe(lugares => {
      this.lugares = lugares;
      this.lugares.forEach(lugar => {
        lugar.id = this.lugaresService.getId(lugar);
      });
      console.log("LUGARES RECIBIDOS: ", this.lugares);
    })
  }

  getLugarPublicacion() {
    this.publicacionesService.getLugarFromPublicacion(this.publicacion).subscribe(lugar => {
      lugar.id = this.lugaresService.getId(lugar);
      this.publicacion.lugar = lugar;
      this.lugarSeleccionado = lugar;

    })
  }

  //LIKES
  getLikes(publicacion: Publicacion) {
    this.likeService.getLikes(publicacion.id).subscribe(likes => {
      likes.forEach(like => {
        like.id = this.likeService.getId(like);
      });
      this.publicacion.likesRecibidos = likes;
      this.numeroLikes = likes.length.toString();
    })
  }

  /* Agregar un podcast al contenido de la publicacion */
  agregarPodcast() {
    this.htmlPodcast = this.htmlPodcast.replace('></iframe>', 'tipo ="podcast"></iframe>');
    this.texto = this.texto + this.htmlPodcast;

  }

  /* Agregar un video de youtube al contenido de la publicacion */
  agregarVideo() {
    this.htmlPodcast = this.htmlPodcast.replace('></iframe>', 'tipo ="youtube"></iframe>');
    this.texto = this.texto + this.htmlVideo;
    this.htmlVideo = "";
  }

  //SELECCION Y RECORTE DE IMAGENES
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

  onSelectFilePreview(event: any) {

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      }
      console.log("EVENT", event.target.files[0])
      this.imageName = event.target.files[0].name;

    }
    console.log("IMAGEN SELECCIONADA EN PC: ", this.imagePreviewUrl)
  }

  getCroppedImage() {
    // this.croppedresult = this.angularCropper.cropper.getCroppedCanvas().toDataURL();
    this.angularCropper.cropper.getCroppedCanvas().toBlob((blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob as Blob);
      reader.onload = () => {
        this.croppedresult = reader.result as string;
        let blobGenerado = blob as Blob;
        let imagenRecortada = new File([blobGenerado], this.nombreImagen, { type: "image/jpeg" })
        this.imagenesService.subirImagen(imagenRecortada, this.publicacion.titulo, "publicacion").subscribe(url => {
          console.log("URL IMAGEN SUBIDA: ", url)
          this.insertarImagenUrl(url);
        })
      }
    }, 'image/jpeg', 0.70)
  }

  getCroppedImagePreview() {
    this.angularCropper2.cropper.getCroppedCanvas().toBlob((blob2) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob2 as Blob);
      reader.onload = () => {
        this.croppedresult = reader.result as string;
        let blobGenerado = blob2 as Blob;
        let imagenRecortada = new File([blobGenerado], this.imageName, { type: "image/jpeg" })
        this.imagenesService.subirImagen(imagenRecortada, this.publicacion.id, "publicacion").subscribe(url => {
          this.setImagePreview(url)
        });
      }
    }, 'image/jpeg', 0.70)
  }

  insertarImagenUrl(urlImagen: string) {
    this.texto = this.texto + '<img src="' + urlImagen + '" width="' + this.anchoImagen + '%" alt="' + this.nombreImagen + '">'
    this.nombreImagen = "";
    urlImagen = "";
    this.imageUrl = "";
    this.imageName = "";
  }

  setImagePreview(urlImagen: string) {
    this.publicacion.imagenPreviewUrl = urlImagen;
    this.imagePreviewUrl = urlImagen;

    console.log("NOMBRE-IMAGEN: ", this.nombreImagen)
    this.texto = "<img src='" + urlImagen + "' width='100%' alt='" + this.nombreImagen + "'>" + this.texto;
    this.nombreImagen = "";
    console.log("TEXTO: ", this.texto)
  }

  redireccionar() {
    this.router.navigate(['/acerca-de/' + this.publicacion.url])
  }


  /* Guardar la publicación automaticamente cada 5 min*/
  autoGuardado() {
    setInterval(() => {
      if (!this.publicacion.publicado) {
        if (this.publicacion.fechaPublicacion = "") {
          this.postPublicacionAutoguardado();
        } else {
          this.patchPublicacionAutoguardado();
        }
      }
    }, 300000)
  }

  //TIP SEO

  /* Analizar el título para comprobar si tiene palabras repetidas, su longitud recomendada y si no contiene caracteres invalidos para formar una url*/
  analizarTitulo() {
    this.palabrasTitulo = this.seoService.contarPalabras(this.publicacion.titulo);
    this.palabrasRepetidasTitulo = this.seoService.analizarPalabrasRepetidas(this.publicacion.titulo);
    this.urlValida = this.seoService.validarURL(this.publicacion.titulo);
    this.caracteresTitulo = this.seoService.contarCaracteres(this.publicacion.titulo);
  }

  /* Analizar el subtítulo. Se escribe en la card y se inserta automaticamente en el texto */
  analizarSubtitulo() {
    this.palabrasDescripcion = this.seoService.contarPalabras(this.publicacion.subtitulo);
    this.texto = this.insertarSubtituloEnHTML();
  }

  /* Analiza el contenido de la publicacion desde el punto de vista SEO */
  analizarTexto() {
    this.analizarEncabezados();
    this.analizarImagenes();
    this.enlaces = this.seoService.analizarEnlaces(this.texto);
    this.numeroEnlaces = this.seoService.contarEnlaces(this.texto);
  }

  analizarEncabezados() {
    //H1 esta reservado para el titulo, el texto no debe tener ninguno.
    if (this.seoService.contarEtiquetas('h1', this.texto) != 0) {
      this.titulosH1 = false;
    } else {
      this.titulosH1 = true;
    }

    //h2 Esta reservado para el subtítulo, el texto solo debe contener uno.
    if (this.seoService.contarEtiquetas('h2', this.texto) != 1) {
      this.titulosH2 = false;
    } else {
      this.titulosH2 = true;
    }

    //h3 El titulo de las diferentes secciones del articulo irá en h3. Debe haber al menos 1
    if (this.seoService.contarEtiquetas('h3', this.texto) < 1) {
      this.titulosH3 = false;
    } else {
      this.titulosH3 = true;
    }

    //Todas las publicaciones deben tener algún enlace
    if (this.seoService.contarEtiquetas('a', this.texto) < 1) {
      this.enlaces = false;
    } else {
      this.enlaces = true;
    }

    //Es conveniente que no tenga mas de 15 imagenes por tiempos de carga
    if (this.seoService.contarEtiquetas('img', this.texto) > 15) {
      this.imgs = false;
    } else {
      this.imgs = true;
    }
  }

  analizarImagenes() {
    this.numeroImgs = this.seoService.getNumeroImgs(this.texto);
    this.srcImgs = this.seoService.comprobarSrcEnImgs(this.texto);
  }


  /* Inserta el subtitulo en la card y en el editor (debajo de la imagen principal) */
  insertarSubtituloEnHTML(): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.texto;

    const primerElemento = tempDiv.firstElementChild;
    const primerParrafoConImagen = tempDiv.querySelector('img');

    if (primerParrafoConImagen) {
      const subtitulo = tempDiv.querySelector('h2');
      if (!subtitulo) {
        const nuevoSubtitulo = document.createElement('h2');
        primerParrafoConImagen.insertAdjacentElement('afterend', nuevoSubtitulo);
        nuevoSubtitulo.textContent = this.publicacion.subtitulo;
      } else {
        subtitulo.textContent = this.publicacion.subtitulo;
      }
    } else {
      const subtitulo = tempDiv.querySelector('h2');
      if (!subtitulo) {
        const nuevoSubtitulo = document.createElement('h2');
        tempDiv.insertAdjacentElement('afterbegin', nuevoSubtitulo);
        nuevoSubtitulo.textContent = this.publicacion.subtitulo;
      } else {
        subtitulo.textContent = this.publicacion.subtitulo;
      }
    }
    return tempDiv.innerHTML;
  }

  //IMPORTADOR


  async importar() {
    if (this.fechaArticuloImportado) {
      this.importarTitulo();
      let doc = this.seleccionarArticulo();
      this.importarContenido(doc);
      console.log("DOC: ", doc)
    } else {

    }

  }

  importarTitulo() {
    const parser = new DOMParser();
    //Obtener el Titulo del articulo
    let htmlTitulo = "";
    const doc1 = parser.parseFromString(this.htmlWordPress, 'text/html');
    // Obtener la etiqueta h1
    const h1Element = doc1.querySelector('h1');
    // Obtener la etiqueta a dentro de h1
    if (h1Element) {
      const aElement = h1Element.querySelector('a');
      if (aElement) {
        // Obtener el texto dentro de la etiqueta a
        if (aElement.textContent) {
          this.publicacion.titulo = aElement.textContent.trimStart();
        }
      }
    }
  }

  seleccionarArticulo(): any {
    const parser = new DOMParser();
    //Obtener unicamente la etiqueta article con el contenido del articulo (no foto principal)
    this.htmlWordPress = this.htmlWordPress.split('<article')[1];
    this.htmlWordPress = this.htmlWordPress.split('</article>')[0];
    this.htmlWordPress = '<article' + this.htmlWordPress + '</article>';
    this.htmlWordPress = this.htmlWordPress.replaceAll('<p><br></p>', '');
    const doc = parser.parseFromString(this.htmlWordPress, 'text/html');

    // Obtener todas las etiquetas de imagen (img) con data-lazy-fallback="1" del HTML y borrarlas
    const imagenesLazy = doc.querySelectorAll('img[data-lazy-fallback="1"]');
    // Eliminar cada etiqueta img con data-lazy-fallback="1" encontrada
    imagenesLazy.forEach((imagen) => {
      imagen.remove();
    });

    //Borrar etiquetas noscript
    const noScripts = doc.querySelectorAll('noscript');
    noScripts.forEach((noscript) => {
      noscript.remove();
    })

    //Borrar la barra de navegacion (etiqueta h2 y 2 etiquetas a)


    // Obtener todas las etiquetas que deseas eliminar del documento
    const etiquetasA = doc.querySelectorAll('a');

    // Convertir el NodeList a un Array y obtener los últimos tres elementos
    const ultimasEtiquetasA = Array.from(etiquetasA).slice(-2);

    // Recorrer los últimos tres elementos y eliminarlos
    ultimasEtiquetasA.forEach(etiqueta => {
      etiqueta.remove();
    });

    // Obtener todas las etiquetas que deseas eliminar del documento
    const etiquetasH2 = doc.querySelectorAll('h2');

    // Convertir el NodeList a un Array y obtener la ultima etiqueta h2
    const ultimaEtiquetaH2 = Array.from(etiquetasH2).slice(-1);
    // Recorrer los últimos tres elementos y eliminarlos
    ultimaEtiquetaH2.forEach(etiqueta => {
      etiqueta.remove();
    });

    return doc;
  }

  async importarContenido(doc: Document) {
    const parser = new DOMParser();
    //Escanear las img, obtener su url, cargarlas en Firebase y modificar el atributo src con el de Firebase

    // Obtener todas las etiquetas de imagen (img) del HTML (sin las imágenes eliminadas)
    const imagenes = doc.getElementsByTagName('img');

    // Recorrer cada imagen y procesarla
    for (let img of Array.from(imagenes)) {
      const src = img.getAttribute('src');

      if (src) {
        // Descargar la imagen y obtener la nueva URL
        const blobResponse = await fetch(src);
        const blob = await blobResponse.blob();
        const file = new File([blob], blob.name + '.png', { type: blob.type });
        this.imagenesService.subirImagen(file, 'id', 'importadas').subscribe(url => {
          setTimeout(() => {
            // Actualizar el atributo src de la imagen con la nueva URL
            if (img.getAttribute('width')) {
              let ancho = parseInt(img.getAttribute('width') ?? '600');
              if (ancho < 250) {
                img.setAttribute('width', '35%');
              } if (ancho > 500) {
                img.setAttribute('width', '75%');
              } if (ancho > 250 && ancho < 500) {
                img.setAttribute('width', '50%');
              }
              /* img.removeAttribute('width'); */

            } else {
              img.setAttribute('width', '75%');
            }
            img.setAttribute('alt', file.name)
            img.removeAttribute('height');
            img.setAttribute('src', url);
            console.log(url);
          }, 1500);
        })
      }
    }
    /* Extraer el subtitulo que se encuentra en una etiqueta li al inicio del articulo y cambiarlo a una etiqueta h2 en la misma posicion */
    const textoSubtitulo = doc.querySelector('li')?.innerText;
    if (textoSubtitulo) {
      this.publicacion.subtitulo = textoSubtitulo;
    }

    const listaSubtitulo = doc.querySelector('ul');
    const nuevoSubtitulo = doc.createElement('h2');
    nuevoSubtitulo.innerText = this.publicacion.subtitulo;
    listaSubtitulo?.appendChild(nuevoSubtitulo);
    const subtituloAntiguo = doc.querySelector('li');
    subtituloAntiguo?.remove();

    setTimeout(() => {
      this.texto = this.texto + doc.documentElement.outerHTML;
      this.texto = this.texto.replaceAll('<figure><img', '<p class="ql-align-center imagen-container text-center"><img')
      this.texto = this.texto.replaceAll('<p><img', '<p class="ql-align-center imagen-container text-center"><img')
    },
      15000);
  }
}



