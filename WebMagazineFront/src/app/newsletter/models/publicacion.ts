import { Lugar } from "./Lugar";
import { Tag } from "./Tag";
import { Cafe } from "./cafe";
import { Like } from "./like";

export class Publicacion {
    id: string= "";
    titulo: string = "";
    subtitulo: string = "";
    htmlPublicacion: string ="";
    premium: boolean = false;
    destacado: boolean = false;
    carousel: boolean = false;
    bloques: any[] = [];
    autor: any;
    fechaPublicacion: string = "";
    likesRecibidos: Like[] = [];
    cafes: Cafe[] = [];
    tags: any[] = [];
    imagenPreviewUrl: string ="";
    lugar: Lugar = new Lugar();
    categoria: any;
    letraOscura: boolean = false;

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
