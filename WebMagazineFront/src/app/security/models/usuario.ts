
import { Direccion } from "src/app/ecommerce/models/direccion";
import { Rol } from "src/app/newsletter/models/Rol";


export class Usuario {
    id: string | undefined = "";
    nombre!: string;
    apellido1!: string;
    apellido2!: string;
    direccion!: Direccion;
    email!: string;
    password!: string; 
    roles: Rol[] = [];
    urlImagen: string =""
    constructor(){

    }
}
