import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CropperComponent } from 'angular-cropperjs';
import { Product } from 'src/app/ecommerce/models/product';
import { Seccion } from 'src/app/ecommerce/models/seccion';
import { ProductService } from 'src/app/ecommerce/service/product.service';
import { SeccionService } from 'src/app/ecommerce/service/seccion.service';
import { ImagenesService } from 'src/app/newsletter/service/imagenes.service';

@Component({
  selector: 'app-formulario-producto',
  templateUrl: './formulario-producto.component.html',
  styleUrls: ['./formulario-producto.component.css'],
})
export class FormularioProductoComponent implements OnInit {
  @ViewChild('angularCropper') angularCropper: CropperComponent =
    new CropperComponent();

  nuevoProducto: Product = new Product('', '', '', '', 0, '', new Seccion());
  secciones: Seccion[] = [];
  seccionSeleccionada: Seccion = new Seccion();

  /* Recortador de imagenes */
  imageUrl: string = '';
  imageName: string = '';
  croppedresult = '';
  anchoImagen: string = '100';
  /*-----------------------*/

  /* controladores del formulario */
  formularioProducto: FormGroup;
  submit: boolean = false;
  esNuevoProducto = true;
  /*-----------------------*/

  constructor(
    private imagenesService: ImagenesService,
    private seccionesService: SeccionService,
    private productoService: ProductService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    /* control de errores del formulario */
    this.formularioProducto = this.fb.group({
      nombreProducto: ['', [Validators.required, Validators.maxLength(50)]],
      descripcionCorta: ['', [Validators.required, Validators.maxLength(50)]],
      descripcionLarga: ['', [Validators.required, Validators.maxLength(100)]],
      precio: ['', [Validators.required, Validators.min(0)]],
      seccion: [new Seccion(), Validators.required],
      url: ['']
    });
    /*-----------------------------------*/
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id']
      if(id){
        this.productoService.getProductoPorId(id).subscribe((res) =>{
          this.esNuevoProducto = false;
          this.nuevoProducto = res;
          this.formularioProducto.patchValue(this.nuevoProducto);
        }
        );
      }
    });

   
    this.seccionesService.getSecciones().subscribe((response) => {
      this.secciones = response;
      this.secciones.forEach((seccion) => {
        seccion.url = this.seccionesService.extraerUrlSeccion(seccion);
        seccion.id = this.seccionesService.getIdSeccion(seccion);
      });
    });
  }

  submitProducto() {
    this.submit = true;
    if (this.formularioProducto.invalid) {
      return;
    }
    if(this.esNuevoProducto){
    this.nuevoProducto = this.formularioProducto.value;
    this.nuevoProducto.seccion = this.seccionSeleccionada;
    this.productoService.postProducto(this.nuevoProducto).subscribe((res) => {
      this.router.navigate(["ecommerce/gestion"]);
    });
  }else{
    let id = this.nuevoProducto.id
    this.nuevoProducto = this.formularioProducto.value;
    this.nuevoProducto.id = id;
    this.nuevoProducto.seccion = this.seccionSeleccionada;
    this.productoService.patchProducto(this.nuevoProducto).subscribe((res) => {
      this.router.navigate(["ecommerce/gestion"]);
    });
  }
  }

  /* metodos para el croper */
  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      console.log('EVENT', event.target.files[0]);
      this.imageName = event.target.files[0].name;
    }
    console.log('IMAGEN SELECCIONADA EN PC: ', this.imageUrl);
  }

  getCroppedImage() {
    // this.croppedresult = this.angularCropper.cropper.getCroppedCanvas().toDataURL();
    this.angularCropper.cropper.getCroppedCanvas().toBlob(
      (blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob as Blob);
        reader.onload = () => {
          this.croppedresult = reader.result as string;
          let blobGenerado = blob as Blob;
          let imagenRecortada = new File([blobGenerado], this.imageName, {
            type: 'image/jpeg',
          });
          this.imagenesService
            .subirImagen(
              imagenRecortada,
              this.nuevoProducto.nombreProducto,
              'producto'
            )
            .subscribe((url) => {
              console.log('URL IMG', url);
              setTimeout(() => {
                console.log('URL IMAGEN SUBIDA: ', url);
                this.nuevoProducto.url = url;
                this.formularioProducto.controls['url'].setValue(url);
              }, 2000);
            });
        };
      },
      'image/jpeg',
      0.7
    );
  }
}
