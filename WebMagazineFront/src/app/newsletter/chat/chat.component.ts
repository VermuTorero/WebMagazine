import { Component, OnInit, ViewChild } from '@angular/core';
import { MensajesService } from '../service/mensajes.service';
import { UsuariosService } from 'src/app/security/service/usuarios.service';
import { Mensaje } from '../models/Mensaje';

import { CropperComponent } from 'angular-cropperjs';
import { ImagenesService } from '../service/imagenes.service';
declare var $: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('angularCropper') angularCropper: CropperComponent = new CropperComponent;
  croppedresult = "";
  mensajeNuevo: string = "";
  imagenNueva: string = "";
  mensajeBorrar: Mensaje = new Mensaje();

  constructor(private mensajeService: MensajesService,
    private usuarioService: UsuariosService,
    private imagenesService: ImagenesService) {

  }

  mensajes: Mensaje[] = [];

  ngOnInit(): void {
    this.getMensajes();
    this.bajarScroll();
  }

  getMensajes() {
    this.mensajeService.getMensajes().subscribe(mensajes => {
      this.mensajes = mensajes;
      this.mensajes.forEach(mensaje => {
        mensaje.id = this.mensajeService.getId(mensaje);
        this.bajarScroll();
      });
    })
  }

  postMensaje() {
    let mensaje = new Mensaje();
    if (this.mensajeNuevo!="" || this.imagenNueva !="") {
      this.usuarioService.getUsuarioFromToken().subscribe(usuario => {
        usuario.id = this.usuarioService.getId(usuario);
        mensaje.usuario = usuario;
        mensaje.texto = this.mensajeNuevo;
        mensaje.imagen = this.imagenNueva;
        this.mensajeService.postMensaje(mensaje).subscribe(mensaje => {
          this.getMensajes();
          this.mensajeNuevo = "";
          this.imagenNueva = "";
  
        }, err => {
  
        }, () => {
  
        })
      });
    }
  }

  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.imagenNueva = reader.result as string;
      }
      console.log("EVENT", event.target.files[0])
      this.imagenNueva = event.target.files[0].name;

    }
    console.log("IMAGEN SELECCIONADA EN PC: ", this.imagenNueva)
  }

  getCroppedImage() {
    // this.croppedresult = this.angularCropper.cropper.getCroppedCanvas().toDataURL();
    this.angularCropper.cropper.getCroppedCanvas().toBlob((blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob as Blob);
      reader.onload = () => {
        this.croppedresult = reader.result as string;
        let blobGenerado = blob as Blob;
        let numero = Math.floor(10000000 * Math.random());
        let imagenRecortada = new File([blobGenerado], numero.toString(), { type: "image/jpeg" })

        this.imagenesService.subirImagen(imagenRecortada, numero.toString(), "imagenChat").subscribe(url => {
          this.imagenNueva = url;
          console.log(url)
          this.postMensaje();
        })
      }
    }, 'image/jpeg', 0.70)
  }

  bajarScroll() {
    setTimeout(function () {
      var chatBox = document.querySelector(".chat-box");
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }, 0);
  }


  deleteMensaje(mensaje: any) {
    this.mensajeBorrar = mensaje;
    $('#confirmarDeleteMensajeModal').modal('show');
  }

  deleteMensajeConfirmado() {
    this.mensajeService.deleteMensaje(this.mensajeBorrar).subscribe(response => {
      $('#confirmadoDeleteMensajeModal').modal('show');
    }, err => {
      $('#errorDeleteMensajeModal').modal('show');
    })
  }
  recargarPagina() {
    document.location.reload();
  }
}
