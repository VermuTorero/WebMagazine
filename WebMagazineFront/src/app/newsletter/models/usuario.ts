import { Rol } from "./Rol";

export class Usuario {
    id: string = "";
    nombre!: string;
    apellido1!: string;
    apellido2!: string;
    direccion!: string;
    user!: string;
    password!: string; 
    rol: Rol = new Rol();
    urlImagen: string =""
    constructor(){

    }
}
