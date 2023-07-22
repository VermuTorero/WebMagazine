import { Component, OnInit, ViewChild } from '@angular/core';
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

const quill = new Quill('#editor', {
  theme: 'snow',
  scrollingContainer: '#scrolling-container',
});


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

  numeroLikes: string = "";
  tituloValido: boolean = false;
  palabrasRepetidasTitulo: string | null = "";

  htmlWordPress: string = "";
  htmlVermuTorero: string = "";




  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private publicacionesService: PublicacionesServiceService,
    private tagsService: TagsServiceService,
    private usuariosService: UsuariosService,
    private imagenesService: ImagenesService,
    private categoriasService: CategoriasServiceService,
    private lugaresService: LugaresServiceService,
    private likeService: LikesService
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
    setInterval(() => {
      if (!this.publicacion.publicado) {
        this.autoGuardado();
      }
    }, 300000)
  }

  ajustarEditor() {
    setTimeout(() => {
      var quilEditor = document
        .getElementsByClassName('ql-editor')[0];
      quilEditor.setAttribute("style", "height: 700px")
    }, 500);
  }

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

      console.log("PUBLICACION CARGADA:", this.publicacion)
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('width="100%" height="352"', 'width="80%" height="200"');
      this.texto = this.publicacion.htmlPublicacion;
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('width="560" height="315"', 'width="90%" height="auto"');
      /* quill.insertText(10, this.publicacion.htmlPublicacion); */
      this.analizarTitulo();
    })
  }

  agregarPodcast() {
    this.htmlPodcast = this.htmlPodcast.replace('></iframe>', 'tipo ="podcast"></iframe>');
    this.texto = this.texto + this.htmlPodcast;

  }

  agregarVideo() {
    this.htmlPodcast = this.htmlPodcast.replace('></iframe>', 'tipo ="youtube"></iframe>');
    this.texto = this.texto + this.htmlVideo;
    this.htmlVideo = "";
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
    if (this.validarURL(this.publicacion.titulo)) {
      this.tituloValido = true;
    } else {
      this.tituloValido = false;
    }
    if (this.publicacion.titulo == "" || this.publicacion.autor.id == ""
      || this.publicacion.lugar.id == "" || this.publicacion.categoria.id == ""
      || this.publicacion.imagenPreviewUrl == "" || this.publicacion.subtitulo == ""
      || this.texto == "" || !this.validarURL(this.publicacion.titulo)) {
      $('#errorModal').modal('show');
    }
    else {
      this.publicacion.htmlPublicacion = this.texto;
      this.publicacion.tags = [];
      this.tagsSeleccionadas.forEach(tag => {
        this.publicacion.tags.push(tag)
      });
      this.descargarTxt();
      this.publicacion.url = this.generarUrl(this.publicacion.titulo);

      this.publicacionesService.postPublicacion(this.publicacion).subscribe(publicacion => {
        this.getPublicacion();
        this.descargarTxt();
        $('#enviadoModal').modal('show');
        this.router.navigate(["/../../publicaciones/" + this.publicacion.url])
      });
    }
  }

  postPublicacionAutoguardado() {
    if (this.validarURL(this.publicacion.titulo)) {
      this.tituloValido = true;
    } else {
      this.tituloValido = false;
    }
    if (this.publicacion.titulo == "" || this.publicacion.autor.id == ""
      || this.publicacion.lugar.id == "" || this.publicacion.categoria.id == ""
      || this.publicacion.imagenPreviewUrl == "" || this.publicacion.subtitulo == ""
      || this.texto == "" || !this.validarURL(this.publicacion.titulo)) {
    }
    else {
      this.publicacion.htmlPublicacion = this.texto;
      this.publicacion.tags = [];
      this.tagsSeleccionadas.forEach(tag => {
        this.publicacion.tags.push(tag)
      });
      this.publicacion.url = this.generarUrl(this.publicacion.titulo);
      this.publicacionesService.postPublicacion(this.publicacion).subscribe(publicacion => {
      });
    }
  }

  patchPublicacion() {
    this.publicacion.htmlPublicacion = this.texto;
    this.publicacion.tags = [];
    this.publicacion.tags = this.tagsSeleccionadas;
    this.publicacion.url = this.generarUrl(this.publicacion.titulo);
    this.publicacionesService.patchPublicacion(this.publicacion).subscribe(publicacionModicada => {
      this.getPublicacion();
      this.descargarTxt();
      this.router.navigate(["/../../publicaciones/" + publicacionModicada.url]);
    })
  }

  patchPublicacionAutoguardado() {
    this.publicacion.htmlPublicacion = this.texto;
    this.publicacion.tags = [];
    this.publicacion.tags = this.tagsSeleccionadas;
    this.publicacion.url = this.generarUrl(this.publicacion.titulo);
    this.publicacionesService.patchPublicacion(this.publicacion).subscribe(publicacionModicada => {
    })
  }

  descargarTxt() {
    let publicacion = JSON.stringify(this.publicacion);
    var blob = new Blob([publicacion], { type: "text/plain;charset=utf-8" });
    saveAs(blob, this.publicacion.titulo + ".txt");
  }

  getTags(): void {
    this.tagsService.getTags().subscribe(tags => {
      this.tags = tags;
      this.tags.forEach(tag => {
        tag.id = this.tagsService.getId(tag);
      });
      console.log("TAGS CON ID:", this.tags)
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
        let imagenRecortada = new File([blobGenerado], this.imageName, { type: "image/jpeg" })
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
    this.texto = this.texto + '<img src="' + urlImagen + '" alt="imagenAlt' + this.anchoImagen + '">'
    urlImagen = "";
    this.imageUrl = "";
    this.imageName = "";
  }

  setImagePreview(urlImagen: string) {
    this.publicacion.imagenPreviewUrl = urlImagen;
    this.imagePreviewUrl = urlImagen;
    this.texto = "<img src='" + urlImagen + "' alt=imagenAlt100 >" + this.texto;
  }

  contarPalabrasTitulo() {
    let arrayPalabras = this.publicacion.titulo.split(' ');
    this.palabrasTitulo = arrayPalabras.length;
  }

  contarPalabrasDescripcion() {
    let arrayPalabras = this.publicacion.subtitulo.split(' ');
    this.palabrasDescripcion = arrayPalabras.length - 1;
  }
  getLikes(publicacion: Publicacion) {
    this.likeService.getLikes(publicacion.id).subscribe(likes => {
      likes.forEach(like => {
        like.id = this.likeService.getId(like);
      });
      this.publicacion.likesRecibidos = likes;
      this.numeroLikes = likes.length.toString();
    })
  }

  redireccionar() {
    this.router.navigate(['/acerca-de/' + this.publicacion.url])
  }

  validarURL(titulo: string) {
    var caracteresReservados = ['$', '&', '\'', '(', ')', '*', '+', ';', '=', '/', '#', '[', ']', '%'];

    for (var i = 0; i < caracteresReservados.length; i++) {
      if (titulo.includes(caracteresReservados[i])) {
        return false;
      }
    }

    return true;
  }

  /*   generarUrl(titulo: string): string{
      titulo = titulo.replaceAll("¿", "-");
      titulo = titulo.replaceAll("¡", "-");
      titulo = titulo.replaceAll("?", "-");
      titulo = titulo.replaceAll("!", "-");
      titulo = titulo.replaceAll(":", "-");
      titulo = titulo.replaceAll(" ", "-");
      return titulo;
    } */

  generarUrl(titulo: string) {
    // Lista de stopwords en español (puedes agregar más según tus necesidades)
    const stopwords = [
      'a', 'al', 'ante', 'bajo', 'cabe', 'con', 'contra', 'de', 'desde',
      'en', 'entre', 'hacia', 'hasta', 'ni', 'la', 'las', 'lo', 'los',
      'para', 'por', 'segun', 'sin', 'sobre', 'tras', 'un', 'una', 'unas',
      'unos', 'y', 'e', 'o', 'u', 'y/o'
    ];

    // Convertimos el título a minúsculas y reemplazamos caracteres especiales y espacios en blanco por guiones
    let urlOptimizada = titulo.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');

    // Separamos las palabras del título
    const palabras = urlOptimizada.split('-');

    // Filtramos las palabras que no son stopwords y eliminamos palabras duplicadas
    const palabrasFiltradas = palabras.filter((palabra, index) => !stopwords.includes(palabra) && palabras.indexOf(palabra) === index);

    // Unimos las palabras filtradas en un único string separado por guiones
    urlOptimizada = palabrasFiltradas.join('-');

    return urlOptimizada;
  }

  analizarTitulo() {
    this.contarPalabrasTitulo();
    this.analizarPalabrasRepetidas();
  }

  analizarPalabrasRepetidas() {
    const normalizedTitle = this.publicacion.titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const palabras = normalizedTitle.toLowerCase().match(/\b\w+\b/g);
    const contador: any = {};
    if (palabras) {
      palabras.forEach((palabra) => {
        if (palabra.length > 3) {
          contador[palabra] = (contador[palabra] || 0) + 1;
        }
      });
      console.log(contador)
      const palabrasRepetidas = Object.keys(contador).filter((palabra) => contador[palabra] >= 3);
      this.palabrasRepetidasTitulo = palabrasRepetidas.join(", ");
    }
  }
  autoGuardado() {
    if (this.publicacion.fechaPublicacion = "") {
      this.postPublicacionAutoguardado();
    } else {
      this.patchPublicacionAutoguardado();
    }
  }

  async importar(): Promise<string> {
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

    //Pbtener unicamente la etiqueta article
    this.htmlWordPress = this.htmlWordPress.split('<article')[1];
    this.htmlWordPress = this.htmlWordPress.split('</article>')[0];
    this.htmlWordPress = '<article' + this.htmlWordPress + '</article>';
    this.htmlWordPress = this.htmlWordPress.replaceAll('<p><br></p>', '');
   


    const doc = parser.parseFromString(this.htmlWordPress, 'text/html');

    // Obtener todas las etiquetas de imagen (img) con data-lazy-fallback="1" del HTML
    const imagenesLazy = doc.querySelectorAll('img[data-lazy-fallback="1"]');

    // Eliminar cada etiqueta img con data-lazy-fallback="1" encontrada
    imagenesLazy.forEach((imagen) => {
      imagen.remove();
    });

    const noScripts = doc.querySelectorAll('noscript');
    noScripts.forEach((noscript) => {
      noscript.remove();
    })
    // Obtener todas las etiquetas de imagen (img) del HTML (sin las imágenes eliminadas)
    const imagenes = doc.getElementsByTagName('img');

    // Recorrer cada imagen y procesarla
    for (let img of Array.from(imagenes)) {
      const src = img.getAttribute('src');
      if (src) {
        // Descargar la imagen y obtener la nueva URL
        const blobResponse = await fetch(src);
        const blob = await blobResponse.blob();
        const file = new File([blob], 'nombre-unico.png', { type: blob.type });
        this.imagenesService.subirImagen(file, 'id', 'importadas').subscribe(url => {
          setTimeout(() => {
            // Actualizar el atributo src de la imagen con la nueva URL
            if (img.getAttribute('width')) {
              let ancho = parseInt(img.getAttribute('width')?? '600');
              if (ancho<250) {
                img.setAttribute('alt', 'imagenAlt35');
              }if(ancho>500){
                img.setAttribute('alt', 'imagenAlt75');
              }if(ancho>250 && ancho<500){
                img.setAttribute('alt', 'imagenAlt50');
              }
            }
          
          
            img.removeAttribute('height');
            img.setAttribute('src', url);
            console.log(url)
          }, 1500);
        })
      }
    }
    setTimeout(() => {
      this.texto = doc.documentElement.outerHTML;
      this.texto = this.texto.replaceAll('aligncenter', 'text-center ql-align-center');
    },
      10000);
    // Devolver el HTML modificado como string
    return doc.documentElement.outerHTML;
  }
}



