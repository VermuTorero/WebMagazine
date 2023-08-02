import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  endpoint: string = environment.urlAPI;

  constructor() { }


  /* Comprobar si el título cumple con las condiciones necesarias */
  validarURL(titulo: string) {
    var caracteresReservados = ['$', '&', '\'', '(', ')', '*', '+', ';', '=', '/', '#', '[', ']', '%'];

    for (var i = 0; i < caracteresReservados.length; i++) {
      if (titulo.includes(caracteresReservados[i])) {
        return false;
      }
    }
    return true;
  }

  /* Generar una url a partir del titulo */
  generarUrl(titulo: string): string {
    // Lista de stopwords en español que se quitaran de la url
    const stopwords = [
      'a', 'al', 'ante', 'bajo', 'cabe', 'con', 'contra', 'de', 'desde',
      'en', 'entre', 'hacia', 'hasta', 'ni', 'el', 'la', 'las', 'lo', 'los',
      'para', 'por', 'segun', 'sin', 'sobre', 'tras', 'un', 'una', 'unas',
      'unos', 'y', 'e', 'o', 'u', 'y/o', "del", "que", "año", "años"
    ];

    // Convertimos el título a minúsculas y reemplazamos caracteres especiales y espacios en blanco por guiones
    let urlOptimizada = titulo.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');

    // Separamos las palabras del título
    const palabras = urlOptimizada.split('-');

    // Filtramos las palabras que no son stopwords y eliminamos palabras duplicadas
    const palabrasFiltradas = palabras.filter((palabra, index) => !stopwords.includes(palabra) && palabras.indexOf(palabra) === index);

    // Unimos las palabras filtradas en un único string separado por guiones
    urlOptimizada = palabrasFiltradas.join('-');

    return urlOptimizada;
  }

  contarPalabras(texto: string): number {
    let arrayPalabras = texto.split(' ');
    return arrayPalabras.length;
  }
  contarCaracteres(texto:string): number{
    return texto.length;
  }

  /* Comprobar que no hay palabras repetidas mas de dos veces */
  analizarPalabrasRepetidas(texto: string): string {
    const normalizedTitle = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const palabras = normalizedTitle.toLowerCase().match(/\b\w+\b/g);
    const contador: any = {};
    var palabrasRepetidas = [];
    if (palabras) {
      palabras.forEach((palabra) => {
        if (palabra.length > 3) {
          contador[palabra] = (contador[palabra] || 0) + 1;
        }
      });
      console.log(contador)
      palabrasRepetidas = Object.keys(contador).filter((palabra) => contador[palabra] >= 3);
      return palabrasRepetidas.join(", ");
    }
    return "";
  }

  comprobarSrcEnImgs(texto: string): boolean {
    let imagenesSrcOk = true;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = texto;

    // Convertimos HTMLCollection a un arreglo utilizando Array.from()
    const imgElements = Array.from(tempDiv.getElementsByTagName('img')) as HTMLImageElement[];
    for (const imgElement of imgElements) {
      const src = imgElement.getAttribute('src');
      if (!src) {
        console.error('Imagen sin atributo "src":', imgElement);
        imagenesSrcOk = false;
        continue;
      }

      const tempImg = new Image();
      tempImg.onload = () => {
        console.log('Imagen válida:', src);
      };
      tempImg.onerror = () => {
        console.error('Error en la imagen:', src);
        imagenesSrcOk = false;
      };
      tempImg.src = src;
    }
    return imagenesSrcOk;
  }

  getNumeroImgs(texto: string): number {
    return texto.split('<img').length - 1;
  }


  analizarEnlaces(texto: string): boolean {
    let enlacesOk = true;
    const parser = new DOMParser();
    const doc = parser.parseFromString(texto, "text/html");
    const enlaces = doc.querySelectorAll("a");
    console.log("NUMERO ENLACES", enlaces.length)
    enlaces.forEach((enlace) => {
      const url = enlace.getAttribute("href");
      if (url) {
        this.comprobarEnlace(url).then((status) => {
          if (status === 200) {
            console.log(`El enlace "${url}" está funcionando correctamente.`);
          } else {
            console.log(`El enlace "${url}" no está disponible o ha devuelto un código de error.`);
            enlacesOk = false;
          }
        }).catch(() => {
          enlacesOk = false;
          console.log(`Error al intentar acceder al enlace "${url}".`);
        });
      }
    });
    return enlacesOk;
  }

  contarEnlaces(texto: string): number {
    const parser = new DOMParser();
    const doc = parser.parseFromString(texto, "text/html");
    const enlaces = doc.querySelectorAll("a");
    return enlaces.length;
  }


  comprobarEnlace(url: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("HEAD", url, true);

      xhr.onload = () => {
        resolve(xhr.status);
      };

      xhr.onerror = () => {
        reject();
      };

      xhr.send();
    });
  }

  contarEtiquetas(textoEtiqueta: string, texto: string): number {
    let etiqueta = "<" + textoEtiqueta;
    return texto.split(etiqueta).length - 1;
  }
}
