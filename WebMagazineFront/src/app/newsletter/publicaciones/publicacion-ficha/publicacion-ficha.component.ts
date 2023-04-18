import { Component, OnInit, ViewChild } from '@angular/core';
import { Publicacion } from '../../models/publicacion';
import { ActivatedRoute, ParamMap, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { PublicacionesServiceService } from '../../service/publicaciones.service';
import Quill from 'quill';
import { Tag } from '../../models/Tag';
import { Autor } from '../../models/autor';
import { environment } from 'src/environments/enviroment';
import { TagsServiceService } from '../../service/tags.service';
import { AutoresServiceService } from '../../service/autores.service';
import { saveAs } from 'file-saver';
import { CropperComponent } from 'angular-cropperjs';
import { ImagenesService } from '../../service/imagenes.service';
import { Lugar } from '../../models/Lugar';
import { CategoriasServiceService } from '../../service/categorias.service';
import { Categoria } from '../../models/Categoria';

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
  id: string = "";
  publicacion: Publicacion = new Publicacion();
  texto: string = "";
  urlImagen: string = "";
  urlVideo: string = "";
  htmlPodcast: string = "";
  htmlVideo: string = "";
  tags: Tag[] = [];
  autores: Autor[] = [];
  tagNueva: Tag = new Tag();
  endpointTags: string = environment.urlAPI + "/tags/";
  endpointAutores: string = environment.urlAPI + "/autores/";
  endpointCategorias: string = environment.urlAPI + "/categorias/";
  autorSeleccionado: Autor = new Autor();
  tagsSeleccionadas: Tag[] = [];
  tagSeleccionada: Tag = new Tag();
  imageUrl: string = "";
  imageName: string = "";
  croppedresult = "";
  anchoImagen: string = "100";
  provinciasTipos: string[] = environment.provincias.provincias;
  provincias: Lugar[] = [];
  provinciaSeleccionada: string = "";
  categorias: Categoria[]= [];
  categoriaSeleccionada: Categoria = new Categoria();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private publicacionesService: PublicacionesServiceService,
    private tagsService: TagsServiceService,
    private autoresService: AutoresServiceService,
    private imagenesService: ImagenesService,
    private categoriasService: CategoriasServiceService
  ) { }

  ngOnInit(): void {
    this.publicacion.autor = new Autor();
    this.publicacion.categoria = new Categoria();
    this.getTags();
    this.getAutores();
    this.getCategorias();
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id']
      if (this.id) {
        this.getPublicacion();
      }
      this.ajustarEditor();
      this.formatLugares();
    })

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
      this.provinciaSeleccionada = publicacion.provincia;
      this.getTagsPublicacion();
      this.getAutorPublicacion();
      this.getCategoriaPublicacion();
      console.log("PUBLICACION CARGADA:", this.publicacion)
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('width="100%" height="352"', 'width="80%" height="200"');
      this.texto = this.publicacion.htmlPublicacion;
      quill.insertText(10, this.publicacion.htmlPublicacion);
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

  postPublicacion() {
    this.publicacion.htmlPublicacion = this.texto;
    this.publicacion.tags = [];
    this.tagsSeleccionadas.forEach(tag => {
      this.publicacion.tags.push(this.endpointTags + tag.id)
    });
    console.log("URLS TAGS SELECCIONADAS", this.publicacion.tags);
    this.publicacion.autor = new Autor();
    this.publicacion.autor = this.endpointAutores + this.autorSeleccionado.id;
    this.publicacion.categoria = new Categoria();
    this.publicacion.categoria = this.endpointCategorias + this.categoriaSeleccionada.id;
    this.publicacion.provincia = this.provinciaSeleccionada;
    this.descargarTxt();
    this.publicacionesService.postPublicacion(this.publicacion).subscribe(publicacion => {

    });

  }

  patchPublicacion() {
    this.publicacion.htmlPublicacion = this.texto;
    this.publicacion.tags = [];
    this.tagsSeleccionadas.forEach(tag => {
      this.publicacion.tags.push(this.endpointTags + tag.id)
    });
    console.log("URLS TAGS SELECCIONADAS", this.publicacion.tags);
    this.publicacion.autor = new Autor();
    this.publicacion.autor = this.endpointAutores + this.autorSeleccionado.id;
    this.publicacion.categoria = new Categoria();
    this.publicacion.categoria = this.endpointCategorias + this.categoriaSeleccionada.id;
    this.publicacion.provincia = this.provinciaSeleccionada;
    this.publicacionesService.patchPublicacion(this.publicacion).subscribe(publicacionModicada => {
      this.publicacion = publicacionModicada;
      this.getPublicacion();
      this.descargarTxt();
      this.router.navigate([''])
    })
  }

  descargarTxt() {
    let autores = JSON.stringify(this.autores);
    let tags = JSON.stringify(this.tags);
    let publicacion = JSON.stringify(this.publicacion);
    var blob = new Blob([publicacion], { type: "text/plain;charset=utf-8" });
    var blob2 = new Blob([tags], { type: "text/plain;charset=utf-8" });
    var blob3 = new Blob([autores], { type: "text/plain;charset=utf-8" });
    saveAs(blob, this.publicacion.titulo + ".txt");
    saveAs(blob2, "tags.txt");
    saveAs(blob3, "autores.txt");
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
    this.autoresService.getAutores().subscribe(autores => {
      console.log(autores)
      this.autores = autores;
      this.autores.forEach(autor => {
        autor.id = this.autoresService.getId(autor);
      });
      console.log("AUTORES CON ID:", this.autores)
    });
  }

  getAutorPublicacion() {
    this.publicacionesService.getAutorFromPublicacion(this.publicacion).subscribe(autorPublicacion => {
      autorPublicacion.id = this.autoresService.getId(autorPublicacion)
      console.log("AUTOR PUBLICACION:", autorPublicacion)
      this.publicacion.autor = autorPublicacion;
      this.autorSeleccionado = autorPublicacion;

    })
  }

  cambiarAutor() {
    for (let index = 0; index < this.autores.length; index++) {
      if (this.autorSeleccionado.id == this.autores[index].id) {
        this.autorSeleccionado.nombre = this.autores[index].nombre;
        this.autorSeleccionado.apellido1 = this.autores[index].apellido1;
        this.autorSeleccionado.apellido2 = this.autores[index].apellido2;
      }
    }
    if (this.autorSeleccionado.nombre != this.publicacion.autor.nombre && this.autorSeleccionado.apellido1 != this.publicacion.autor.apellido1) {
      this.publicacion.autor = this.autorSeleccionado;
    } else {
      this.publicacion.autor = this.endpointAutores + this.publicacion.autor.id;
    }

  }

  getCategorias(){
    this.categoriasService.getCategorias().subscribe(categorias=>{
      this.categorias = categorias;
      this.categorias.forEach(categoria => {
        categoria.id = this.categoriasService.getId(categoria);
      });
      console.log("CATEGORIAS RECIBIDAS: ", this.categorias)
    })
  }
  getCategoriaPublicacion(){
    this.publicacionesService.getCategoriaFromPublicacion(this.publicacion).subscribe(categoria=>{
      categoria.id = this.categoriasService.getId(categoria);
      console.log("CATEG: ", categoria)
      this.publicacion.categoria = categoria;
      this.categoriaSeleccionada = categoria;
     
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
        this.imagenesService.subirImagen(imagenRecortada, this.publicacion.id, "preview").subscribe(url => {
          console.log("URL IMG", url)
          setTimeout(() => {
            this.insertarImagenUrl(url);
          }, 1200)
        });

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
        this.imagenesService.subirImagen(imagenRecortada, this.publicacion.id, "preview").subscribe(url => {
          console.log("URL IMG", url)
          setTimeout(() => {
            this.insertarImagenAutorUrl(url);
          }, 1200)
        });

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
        this.imagenesService.subirImagen(imagenRecortada, this.publicacion.id, "preview").subscribe(url => {
          console.log("URL IMG", url)
          setTimeout(() => {
            this.setImagePreview(url)
            url = []
          }, 1200)
        });
      }
    }, 'image/jpeg', 0.70)
  }

  insertarImagenUrl(urlImagen: string[]) {
    this.texto = this.texto + '<img src="' + urlImagen[0] + '" alt="imagenAlt' + this.anchoImagen + '">'
    urlImagen = [];
    this.imageUrl = "";
    this.imageName = "";
  }
  insertarImagenAutorUrl(urlImagen: string[]){
    this.autorSeleccionado.urlImagen = urlImagen[0];
  }

  setImagePreview(urlImagen: string[]) {
    this.publicacion.imagenPreviewUrl = urlImagen[0];
  }

  formatLugares() {
    this.provincias = [];
    this.provinciasTipos.forEach(provinciaNombre => {
      let lugar = new Lugar();
      lugar.provincia = provinciaNombre;
      this.provincias.push(lugar);
    });
    console.log("Provincias", this.provincias);
  }

}