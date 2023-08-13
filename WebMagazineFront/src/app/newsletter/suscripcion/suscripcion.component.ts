import { Component, OnInit, ViewChild } from '@angular/core';
import { TipoSuscripcion } from '../models/TipoSuscripcion';
import { TipoSuscripcionService } from '../service/tiposSuscripcion.service';
import { Usuario } from 'src/app/security/models/usuario';
import { UsuariosService } from 'src/app/security/service/usuarios.service';
import { Rol } from '../models/Rol';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalReceiptComponent } from 'src/app/ecommerce/components/modal-receipt/modal-receipt.component';
import { paypalConfig } from 'src/environments/paypalConfig';
import { CropperComponent } from 'angular-cropperjs';
import { ImagenesService } from '../service/imagenes.service';
import { PayPalService } from '../service/paypal.service';
declare var $: any;

@Component({
  selector: 'app-suscripcion',
  templateUrl: './suscripcion.component.html',
  styleUrls: ['./suscripcion.component.css']
})
export class SuscripcionComponent implements OnInit {

  @ViewChild('angularCropper') angularCropper: CropperComponent = new CropperComponent;
  croppedresult = "";
  imageUrl: string = "";
  nombreImagen: string = "";
  @ViewChild('modalPaypal') modalPaypal: any;
  suscripciones: TipoSuscripcion[] = [];
  usuarioNuevo: Usuario = new Usuario();
  usuarioConfirmando: Usuario = new Usuario();
  password2: string = "";
  //variable paypal
  public payPalConfig?: IPayPalConfig;
  suscripcion: any[] = [];
  clientId: string = "";
  precioVino: string = "";
 



  constructor(private tiposSuscripcionService: TipoSuscripcionService,
    private usuariosService: UsuariosService,
    private modalService:  NgbModal,
    private spinner: NgxSpinnerService,
    private imagenesService: ImagenesService,
    private payPalService: PayPalService) {

  }

  ngOnInit(): void {
    this.getSuscripciones();
    let rol = new Rol();
    rol.rolNombre = "";
    this.usuarioNuevo.roles = [rol];
    this.getPayPal();
  }

  getSuscripciones() {
    this.tiposSuscripcionService.getTiposSuscripcion().subscribe(tipos => {
      this.suscripciones = tipos;
      this.suscripciones.forEach(suscripcion => {
        suscripcion.id = this.tiposSuscripcionService.getId(suscripcion);
      });
    })
  }

  postUsuarioTipo1() {
    this.usuarioNuevo.roles[0].rolNombre = "ROLE_USER_REGISTERED";
    this.postUsuario(this.suscripciones[0].precio);
  }

  postUsuarioTipo2() {
    this.usuarioNuevo.roles[0].rolNombre = "ROLE_USER_SUBSCRIBED";
    this.postUsuario(this.suscripciones[1].precio);
  }

  postUsuarioTipo3() {
    this.usuarioNuevo.roles[0].rolNombre = "ROLE_USER_MEMBER";
    this.postUsuario(this.suscripciones[2].precio);
  }

  postUsuario(precio: string) {
    const verificationWindow = window.open('/verificacion-pago', '_blank', 'width=600,height=400');
    this.usuarioNuevo.urlImagen = this.imageUrl;
    this.usuariosService.postUsuario(this.usuarioNuevo).subscribe(usuario => {
      this.usuarioConfirmando.id = this.usuariosService.getId(usuario);
      this.usuarioConfirmando = usuario;
    });
  
    const interval = setInterval(() => {
      if (!this.usuarioConfirmando.isConfirmadoEmail) {
        this.usuariosService.getIsConfirmed(this.usuarioNuevo.email).subscribe(UsuarioIsConfirmed => {
          this.usuarioConfirmando.isConfirmadoEmail = UsuarioIsConfirmed.isConfirmadoEmail;
        });
      } else {
        clearInterval(interval);
        if (precio!="0") {
          this.pagar(precio);
          this.initConfig(precio);
        }
    
        if(verificationWindow){
          verificationWindow.close(); // Cerrar la ventana de verificación
        }
      }
    }, 3000);
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
          this.usuarioNuevo.urlImagen = url;
          this.imageUrl = url;
          this.nombreImagen = "";
        })
      }
    }, 'image/jpeg', 0.70)
  }

  pagar(precio: string): void {
    this.modalService.open(this.modalPaypal, {
      size: 'm',
      windowClass: 'modalPaypal'
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
              items: [{name: "suscripcion", quantity: "1", unit_amount: {value: precio, currency_code: 'EUR'}}],
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
        //mostramos un spinner mientras se procesa el pago
        this.spinner.show();
        actions.order.get().then((details: any) => {  
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          'Pagado: ',
          data
        );
        this.usuariosService.setIsPaid(this.usuarioNuevo.email).subscribe(response=>{
          this.modalService.dismissAll();
          $('#pagadoModal').modal('show');
        });
       

      },
      onCancel: (data, actions) => {
        this.modalService.dismissAll();
        $('#errorPagoSuscripcionModal').modal('show');
        console.log('Cancelado: ', data, actions);
      },
      onError: (err) => {
        this.modalService.dismissAll();
        $('#errorPagoSuscripcionModal').modal('show');
        console.log('Error en pago: ', err);
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
  
  getPayPal(){
    this.payPalService.getPayPal().subscribe(paypal=>{
      this.clientId = paypal.clientId;
      this.precioVino = paypal.precioVino;
    })
  }
}
