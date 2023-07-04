import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/security/models/usuario';
import { UsuariosService } from 'src/app/security/service/usuarios.service';
import { clear } from 'console';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalReceiptComponent } from 'src/app/ecommerce/components/modal-receipt/modal-receipt.component';
import { TipoSuscripcionService } from '../../service/tiposSuscripcion.service';
import { Rol } from '../../models/Rol';
import { TipoSuscripcion } from '../../models/TipoSuscripcion';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-renovar-suscripcion',
  templateUrl: './renovar-suscripcion.component.html',
  styleUrls: ['./renovar-suscripcion.component.css']
})
export class RenovarSuscripcionComponent {

  @ViewChild('modalRenovarPaypal') modalRenovarPaypal: any;
  suscripciones: TipoSuscripcion[] = [];
  usuarioNuevo: Usuario = new Usuario();
  usuarioConfirmando: Usuario = new Usuario();
  password2: string = "";
  //variable paypal
  public payPalConfig?: IPayPalConfig;
  suscripcion: any[] = [];


  constructor(private tiposSuscripcionService: TipoSuscripcionService, private usuariosService: UsuariosService,
    private modalService:  NgbModal,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
  
    this.getUsuario();
    this.getSuscripciones();
   
  }

  getUsuario(){
    this.usuariosService.getUsuarioFromToken().subscribe(usuario=>{
      usuario.id = this.usuariosService.getId(usuario);
      this.usuarioNuevo = usuario;
      let rol = new Rol();
      rol.rolNombre = "";
      this.usuarioNuevo.roles = [rol];
    })
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
    this.patchUsuario(this.suscripciones[0].precio);
  }

  postUsuarioTipo2() {
    this.usuarioNuevo.roles[0].rolNombre = "ROLE_USER_SUBSCRIBED";
    this.patchUsuario(this.suscripciones[1].precio);
  }

  postUsuarioTipo3() {
    this.usuarioNuevo.roles[0].rolNombre = "ROLE_USER_MEMBER";
    this.patchUsuario(this.suscripciones[2].precio);
  }

  patchUsuario(precio: string) {
    this.usuariosService.patchUsuarioRenovado(this.usuarioNuevo).subscribe(usuario => {
      this.usuarioConfirmando.id = this.usuariosService.getId(usuario);
      this.usuarioConfirmando = usuario;
      this.pagar(precio);
      this.initConfig(precio);
    });
  
  }

  pagar(precio: string): void {
    this.modalService.open(this.modalRenovarPaypal, {
      size: 'm',
      windowClass: 'modalRenovarPaypal'
    });
   this.initConfig(precio);
  }

  // metodo paypal
  private initConfig(precio: string): void {
    this.payPalConfig = {
      currency: 'EUR',
      //colocar id de la pagina paypal developer, en proyecto meter variable en enviroment
      clientId:
        'AQ4kV3ijEVIItPbgLJtApqQdCEfaNV-xFShpVgdS8lmlI-J_L7U1-UPdiuXVbsivQfZyVQ43csdQJXCT',
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
        /* this.spinner.show(); */
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

        this.usuariosService.setIsPaid(this.usuarioNuevo.email).subscribe();
       

      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: (err) => {
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
