import { Usuario } from "src/app/security/models/usuario";
import { Categoria } from "./Categoria";
import { Tag } from "./Tag";

export class Click {
    id: string = "";
    categoriaClick: Categoria = new Categoria();
    tagsClick: Tag[]=[];
    fechaClick: string = "";
    usuario: Usuario = new Usuario();
}
