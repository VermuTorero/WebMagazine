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
    url: string = "";
    publicado: boolean = false;
    keyWords: string[] = [];
    imagenCarouselUrl: string = "";

    constructor(){

    }

}
