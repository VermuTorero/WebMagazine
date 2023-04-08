import { Tag } from "./Tag";
import { Autor } from "./autor";
import { Cafe } from "./cafe";
import { Like } from "./like";

export class Publicacion {
    id: string= "";
    titulo: string = "";
    subtitulo: string = "";
    htmlPublicacion: string ="";
    premium: boolean = false;
    destacado: boolean = false;
    bloques: any[] = [];
    autor: Autor = new Autor();
    fechaPublicacion: string = "";
    likesRecibidos: Like[] = [];
    cafes: Cafe[] = [];
    tags: Tag[] = []

    constructor(){

    }

/*     constructor(id: number, titulo: string, subtitulo: string, isPremium: boolean, bloques: Bloque[], 
        autor: Autor, fechaPublicacion: String, likesRecibidos: Like[], cafes: Cafe[]) {
            this.id=id;
            this.titulo=titulo;
            this.subtitulo=subtitulo;
            this.isPremium=isPremium;
            this.bloques=bloques;
            this.autor=autor;
            this.fechaPublicacion=fechaPublicacion;
            this.likesRecibidos=likesRecibidos;
            this.cafes=cafes;
    } */
}
