
import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { Direccion } from '../../models/direccion';
import { CartItemModel } from '../../models/cart-item-model';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Pedido } from '../../models/pedido';
import { PedidosService } from '../../service/pedidos.service';
import { ModalReceiptComponent } from '../modal-receipt/modal-receipt.component';
import { environment } from 'src/environments/environment';
import { PedidoProducto } from '../../models/pedido-producto';
import { Observable, forkJoin, map } from 'rxjs';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/security/service/usuarios.service';
import { Usuario } from 'src/app/security/models/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

  endpoint: string = environment.urlAPI + "/productos/";

  usuario = new Usuario();
  direccionEnvio!: Direccion;
  direccionesUsuario: Direccion[] = [];
  productosCarrito: CartItemModel[] = [];
  precioTotal: number = 0;
   //variable paypal
   public payPalConfig?: IPayPalConfig;

   /* controladores del formulario */
  formularioDireccion: FormGroup;
  submit: boolean = false;
  esNuevaDireccion = true;
  direccionNueva!: Direccion;
  direccionSeleccionada!: Direccion;
  /*-----------------------*/
  

  constructor(
    private storageService: StorageService,
    private UsuariosService: UsuariosService,
    private modalService:  NgbModal,
    private spinner: NgxSpinnerService,
    private pedidoService: PedidosService,
    private router: Router,
    private fb: FormBuilder
  ) {
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
    this.esNuevaDireccion = true;
    //1º traemos el usuario con sus datos de la API, posteriormente lo leera de la sesión
    this.UsuariosService.getUsuarioFromToken().subscribe((usuario) =>{
      usuario.id = this.UsuariosService.getId(usuario);
      this.usuario = usuario;
      console.log(this.usuario);
      //2º sacamos la direccion de envio del usuario
      const url = this.UsuariosService.extraerUrlDireccionUsuario(this.usuario);
      this.UsuariosService.getDirecciones().subscribe((res2) =>{
        this.direccionesUsuario = res2;
        console.log(res2);
        if(this.direccionesUsuario.length > 0){
          this.esNuevaDireccion = false;
          this.direccionEnvio = this.direccionesUsuario[0];
        }
      }
      );
    });
    //3º leemos los productos del carrito
    this.productosCarrito = this.storageService.getCart();
    this.precioTotal = this.getTotal();

  }

  getTotal(): number {
    let total = 0;
    this.productosCarrito.forEach((item) => {
      total += item.qty * item.productPrice;
    });
    return +total.toFixed(2);
  }

  emptyCart(): void {
    this.productosCarrito = [];
    this.precioTotal = 0;
    this.storageService.clear();
  }

  getItemsList(): any[]{
    const items: any[] = [];
    let item = {};
    // productos del carrito lo metemos en un array con el formato de paypal
    //name, quantity, unit_amount
    this.productosCarrito.forEach((it: CartItemModel) => {
      item = {
        name: it.productName,
        quantity: it.qty,
        unit_amount: {value: it.productPrice, currency_code: 'EUR'}
      };
      items.push(item);
  });
  return items;
}

pagar(modal: any): void{
this.modalService.open(modal,{
  size: 'm',
  windowClass: 'modalPaypal'
});
this.initConfig();
}

  // metodo paypal
 private initConfig(): void {
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
              value: this.getTotal().toString(),
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: this.getTotal().toString(),
                },
              },
            },
            // colocamos los items del carrito con el metodo getItemsList
            items: this.getItemsList(),
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

      //creamos el pedido
      this.direccionEnvio.idDireccion = this.pedidoService.getIdDireccion(this.direccionEnvio);
      let nuevoPedido = new Pedido(this.direccionEnvio, this.getTotal());

      //agregamos el usuario al pedido
      nuevoPedido.usuario = this.usuario;

      //creamos los pedidos de cada producto.
      // Para cada producto en el carrito, creamos un pedido utilizando la clase PedidoProducto y lo guardamos en un array de pedidosProductos.
      let pedidosProductos: Observable<any>[] = [];


      this.productosCarrito.forEach((producto) =>{
        let pedidoProducto = new PedidoProducto(this.endpoint + producto.productId, producto.qty);
        pedidosProductos.push(this.pedidoService.postPedidoProducto(pedidoProducto).pipe(map((res) =>{
          console.log(res, "res API PEDIDO-PRODUCTO")
          let producto = res;
          producto.id = this.UsuariosService.getId(producto);
         nuevoPedido.productos.push(producto);
         console.log(nuevoPedido.productos, "nuevoProducto URL")
        }))); // Guardamos cada pedido en la API

      });
      
      // Utilizamos forkJoin para esperar a que se completen todas las llamadas a postPedidoProducto antes de continuar.
      forkJoin(pedidosProductos).subscribe(() => {
        // Llamamos al endPoint para enviar el pedido completo a la API
        this.pedidoService.postPedido(nuevoPedido).subscribe((res) =>{
          console.log(nuevoPedido, "envio API PEDIDO");
          console.log(res, "res API PEDIDO");
          this.emptyCart();
          this.spinner.hide();
          //cerramos el modal de paypal
          this.modalService.dismissAll();

          // Redireccionamos al usuario a la página /ecommerce
          this.router.navigate(['/ecommerce']);
      
          // Al autorizar la transacción abrimos el modal y le pasamos los datos(data) al modal para que lo muestre
          this.openModal(
            data.purchase_units[0].items,
            data.purchase_units[0].amount.value
          );
        });
      });

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

openModal(items: any, amount: any): void{
  const modalRef = this.modalService.open(ModalReceiptComponent, {size: 'lg'});
  modalRef.componentInstance.items = items;
  modalRef.componentInstance.amount = amount
}

submitDireccion() {
  this.submit = true;
  if (this.formularioDireccion.invalid) {
    return;
  }else{
    this.direccionNueva = this.formularioDireccion.value;
    this.direccionNueva.usuario = this.usuario;
    this.UsuariosService.postDireccion(this.direccionNueva).subscribe((res) =>{
      this.esNuevaDireccion = false;
      this.direccionEnvio = res;
      this.direccionesUsuario.push(res);
    });
  }
}

nuevaDireccion() {
  this.esNuevaDireccion = true;
}

actualizarDireccionEnvio(){
  if (this.direccionEnvio) {
    this.direccionSeleccionada = this.direccionEnvio;
    this.esNuevaDireccion = false;
  }
}


}
