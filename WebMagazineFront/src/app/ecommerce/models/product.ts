import { Seccion } from "./seccion";

export class Product {
    id: string;
    nombreProducto: string;
    descripcionCorta: string;
    descripcionLarga: string;
    precio: number;
    url: string;
    seccion: Seccion = new Seccion();
    vendedorExterno: string;


    constructor(id:string, name: string, description: string, descripcionLarga: string, price: number, imageUrl: string, seccion: Seccion, vendedorExterno: string){
        this.id = id;
        this.nombreProducto = name;
        this.descripcionCorta = description;
        this.descripcionLarga= descripcionLarga;
        this.precio = price;
        this.url = imageUrl; 
        this.seccion = seccion;   
        this.vendedorExterno = vendedorExterno;
    }
}
