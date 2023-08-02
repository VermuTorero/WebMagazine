import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Publicacion } from '../models/publicacion';


@Injectable({
  providedIn: 'root'
})
export class MetaService {

  constructor() { }

  guardarLocalStorageMetaPaginaPrincipal(){
    localStorage.setItem("title", "Vermú Torero");
    localStorage.setItem("description", "La revista digital y podcast del aperitivo a la cena. Vinos, restaurantes, viajes, eventos culturales, estilos de vida.");
    localStorage.setItem("keyWords", "revista, digital, aperitivo, comer, comida, cena, cenar, viajes, viajar, vino, carnes, gastronomía, turismo");
    localStorage.setItem("autor", "Elisabeth G. Iborra");
  }

  guardarLocalStorageMetaPublicacion(publicacion: Publicacion){
    localStorage.setItem("title", publicacion.titulo + "-" + "Vermú Torero");
    localStorage.setItem("description", publicacion.subtitulo);
    localStorage.setItem("keyWords", this.generarKeyWords(publicacion.keyWords));
    localStorage.setItem("autor", publicacion.autor.nombre + " " + publicacion.autor.apellido1 + " " + publicacion.autor.apellido2);
    localStorage.setItem("url", publicacion.url);
  }

  generarKeyWords(arrayKeywords: string[]): string{
    let keyWords = "";
    arrayKeywords.forEach(keyWord=> {
      if (keyWords!=="" && keyWord!==""){
        keyWords = keyWords +  ", " + keyWord; 
      }
      if (keyWords=="") {
        keyWords = keyWord;
      }
    });
    return keyWords;
  };

  setMetaTagsFromLocalStorage() {

    const title = localStorage.getItem("title");
    const etiquetaTitle = document.getElementById("title");
    if (title && etiquetaTitle) {
      etiquetaTitle.textContent = title;
    }
    if (!title && etiquetaTitle) {
      etiquetaTitle.textContent = "Vermú Torero";
    }

    const description = localStorage.getItem("description");
    const etiquetaDescription = document.getElementById("description");
    if (description && etiquetaDescription) {
      etiquetaDescription.setAttribute('content', description);
    }
    if (!description && etiquetaDescription) {
      etiquetaDescription.setAttribute('content', "La revista digital y podcast del aperitivo a la cena");
    }

    const keyWords = localStorage.getItem("keyWords");
    const etiquetaKeyWords = document.getElementById("keyWords")
    if (keyWords && etiquetaKeyWords) {
      etiquetaKeyWords.setAttribute('content', keyWords);
    }
    if (!keyWords && etiquetaKeyWords) {
      etiquetaKeyWords.setAttribute('content', "revista, digital, aperitivo, comer, comida, cena, cenar, viajes, viajar, vino, carnes, gastronomía, turismo");
    }


    const autor = localStorage.getItem("autor");
    const etiquetaAutor = document.getElementById("author");
    if (autor && etiquetaAutor) {
      etiquetaAutor.setAttribute('content', autor);
    }
    if (!autor && etiquetaAutor) {
      etiquetaAutor.setAttribute('content', "Elisabeth G. Iborra");
    }

    const url = localStorage.getItem("url");
    const etiquetaUrl = document.getElementById("urlCompleta");
    if (url && etiquetaUrl) {
      etiquetaUrl.setAttribute('href', 'https://webmagazine-3758a.web.app/publicaciones/' + url);
    }
    if (!url && etiquetaUrl) {
      etiquetaUrl.remove();
    }
  }
}
