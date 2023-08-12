import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { UsuariosService } from '../../service/usuarios.service';
import { RolesService } from '../../service/roles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { TokenService } from '../../service/token.service';
import { Rol } from 'src/app/newsletter/models/Rol';
import { Direccion } from 'src/app/ecommerce/models/direccion';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CropperComponent } from 'angular-cropperjs';
import { ImagenesService } from 'src/app/newsletter/service/imagenes.service';
declare var $: any;

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  usuario: Usuario = new Usuario();
  rol: Rol = new Rol();
  roles: Rol[] = [this.rol];
  rolNombreSeleccionado: string = "";
  password2: string = "";
  claveRecuperacion: string | null = "";
  email: string | null="";
  direccionesUsuario: Direccion[] = [];
  direccionSeleccionada!: Direccion;

  /* controladores del formulario */
  formularioDireccion: FormGroup;
  submit: boolean = false;
  esNuevaDireccion = true;
  direccionNueva!: Direccion;
  /*-----------------------*/

  @ViewChild('angularCropper') angularCropper: CropperComponent = new CropperComponent;
  croppedresult = "";
  imageUrl: string = "";
  nombreImagen: string = "";


  constructor(private usuariosService: UsuariosService, private loginService: LoginService,
     private tokenService: TokenService,private rolesService: RolesService, 
     private activatedRoute: ActivatedRoute, private router: Router, private fb: FormBuilder, private imagenesService: ImagenesService) {

      /* control de errores del formulario */
 this.formularioDireccion = this.fb.group({
  calle: ['', [Validators.required, Validators.maxLength(50)]],
  ciudad: ['', [Validators.required, Validators.maxLength(50)]],
  numero: ['', [Validators.required, Validators.min(0)]],
  piso: ['', [Validators.min(0)]],
  puerta: ['', Validators.maxLength(10)],
  codigoPostal: ['', [Validators.required, Validators.min(0)]]
});
/*-----------------------------------*/
  }
  ngOnInit(): void {
    this.usuario.roles = this.roles;
    var params = new URLSearchParams(window.location.search);
    this.claveRecuperacion = params.get('claveRecuperacion');
    this.email = params.get('email');
    if (this.claveRecuperacion == undefined) {
      this.getUsuarioFromToken();
    }else{
      this.getUsuarioFromClaveRecuperacion();
    }
    this.usuariosService.getDirecciones().subscribe((direcciones) =>{
      direcciones.forEach(direccion=> {
        direccion.idDireccion = this.usuariosService.getId(direccion);
      });
      this.direccionesUsuario = direcciones;
    }
    );
    
  }
  getUsuarioFromToken() {
    this.usuariosService.getUsuarioFromToken().subscribe(usuario => {
      usuario.id = this.usuariosService.getId(usuario);
      this.usuario = usuario;
      this.rolesService.getRolesFromUsuario(this.usuario).subscribe(roles => {
        this.usuario.roles = roles;
        console.log("USUARIO: " + this.usuario.roles[0].rolNombre)
      })
    })
  }
  getUsuarioFromClaveRecuperacion(){
    this.loginService.getTokenFromClaveRecuperacion(this.claveRecuperacion, this.email).subscribe(token=>{
      this.tokenService.setToken(token);
      this.getUsuarioFromToken();
    })
  }

  patchUsuario() {
    if(this.usuario.password == this.password2 && this.usuario.password != null && this.usuario.password != undefined && this.usuario.password != ""){
      this.usuariosService.cambiarPassword(this.usuario).subscribe();
    }
    this.usuariosService.patchUsuarioRenovado(this.usuario).subscribe(usuario => {
      usuario.id = this.usuariosService.getId(usuario);
      this.usuario = usuario;
      $('#modificadoModal').modal('show');
    })
  }

  eliminarUsuario(){
    this.usuariosService.deleteUsuarioFromToken().subscribe(response=>{
      $('#confirmadoEliminarUsuarioPropioModal').modal('show');
      setTimeout(()=>{
        $('#confirmadoEliminarUsuarioPropioModal').modal('hide');
        this.router.navigate([''])
      }, 3000)
    }, err=>{
      $('#errorEliminarUsuarioPropioModal').modal('show');
    })
  }

  eliminarDireccion(id: string): void{
    this.usuariosService.deleteDireccion(id).subscribe(() =>{
      window.location.reload();
    });
  }

  submitDireccion() {
    this.submit = true;
    if (this.formularioDireccion.invalid) {
      return;
    }else{
      this.direccionNueva = this.formularioDireccion.value;
      this.direccionNueva.usuario = this.usuario;
      this.usuariosService.postDireccion(this.direccionNueva).subscribe((res) =>{
        this.esNuevaDireccion = false;
        this.direccionesUsuario.push(res);
      });
    }
  }
  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      }
      this.imageUrl = event.target.files[0].name;
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
        let imagenRecortada = new File([blobGenerado], this.nombreImagen, { type: "image/jpeg" })
        this.imagenesService.subirImagen(imagenRecortada, this.nombreImagen, "publicacion").subscribe(url => {
          console.log("URL FIRE: ", url)
          this.usuario.urlImagen = url;
          this.imageUrl = url;
          this.nombreImagen = "";
        })
      }
    }, 'image/jpeg', 0.70)
  }

}
