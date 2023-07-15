import { Usuario } from "src/app/security/models/usuario";

export class Mensaje {
    id: string = "";
    texto: string = "";
    imagen: string = "";
    fecha: string = "";
    usuario: Usuario = new Usuario();
}
