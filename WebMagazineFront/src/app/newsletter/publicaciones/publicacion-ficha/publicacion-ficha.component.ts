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
  autorSeleccionado: Autor = new Autor();
  tagsSeleccionadas: Tag[] = [];
  tagSeleccionada: Tag = new Tag();
  imageUrl: string = "";
  imageName: string = "";
  croppedresult = "";




  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private publicacionesService: PublicacionesServiceService,
    private tagsService: TagsServiceService,
    private autoresService: AutoresServiceService,
    private imagenesService: ImagenesService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id']
      this.getTags();
      this.getAutores();
      if (this.id) {
        this.getPublicacion();
      }
      this.ajustarEditor();
    })
    
  }

  ajustarEditor() {
    setTimeout(() => {
      var quilEditor = document
        .getElementsByClassName('ql-editor')[0];
      quilEditor.setAttribute("style", "height: 1200px")
    }, 500);
  }

  getId(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id']
    })
  }

  getPublicacion() {
    this.publicacionesService.getPublicacion(this.id).subscribe(publicacion => {
      this.publicacion = publicacion;
      this.publicacion.id = this.id;
      this.getTagsPublicacion();
      this.getAutorPublicacion();
      console.log("PUBLICACION CARGADA:", this.publicacion)
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('width="100%" height="352"', 'width="80%" height="200"');
      this.texto = this.publicacion.htmlPublicacion;
      quill.insertText(10, this.publicacion.htmlPublicacion);
    })
  }

  agregarPodcast() {
    this.texto = this.texto + this.htmlPodcast;
  }

  agregarVideo() {
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
            this.insertarImagenUrl(url);
          }, 1200)
        });

      }
    }, 'image/jpeg', 0.70)
  }
  insertarImagenUrl(urlImagen: string[]) {
    this.texto = this.texto + '<img src="' + urlImagen[0] + '" alt="imagenAlt">'
  }
}
