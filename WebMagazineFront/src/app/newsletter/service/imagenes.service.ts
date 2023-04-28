import { Injectable } from '@angular/core';

import { Imagen } from '../models/imagen';
import { Observable, of } from 'rxjs';
import { firebaseConfig } from 'src/environments/firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as refer, onValue, set } from "firebase/database";


import { from } from "rxjs";
import { switchMap, tap, map } from "rxjs/operators";


import { initializeApp } from "firebase/app";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/enviroment';
import { ImagenInicio } from '../models/imagenInicio';


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getDatabase(app);

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {
  urlImagen: string = "";
  endpoint: string = environment.urlAPI;

  constructor(private http: HttpClient) { }

/*   getImagen(): Observable<Imagen[]> {
    let imagenes: Imagen[] = [];
    //Creo la referencia al nodo que quiero recuperar
    var imagenPrincipalRef = app
      .database()
      .ref()
      .child(`imagenes/${id}/principal`);
    //Recupero la informacion y la asigno al array de imagenes
    imagenPrincipalRef.on("value", (snapshot: any) => {
      let data = snapshot.val();
      for (var key in data) {
        let imagen = new Imagen();
        imagen.url = data[key].url;
        imagen.nombre = data[key].nombre;
        imagen.tipo = data[key].tipo;
        imagenes.push(imagen);
      }
    });
    return of(imagenes);
  } */

  subirImagen(file: File, id: string, tipo: string): Observable<string> {
    let arrayNombre = file.name.split(".");
    let num = Math.floor(Math.random()*1000);
    arrayNombre[0] = arrayNombre[0] + num;

    //Creo una referencia en el storage
    const storageRef = ref(storage, `imagenes/${tipo}/${id}/${arrayNombre[0]}`);
    //Subir el archivo al storage
    return from(uploadBytes(storageRef, file)).pipe(
      switchMap((data) => {
        // Obtener la URL de descarga
        return from(getDownloadURL(storageRef)).pipe(
          tap((url) => {
            // Actualizar la información en la base de datos
            set(refer(db, `imagenes/${tipo}/${id}/${arrayNombre[0]}`), {
              nombre: file.name,
              url: url,
              tipo: tipo
            });
          }),
          map((url) => {
            // Devolver la URL de descarga
            return url;
          })
        );
      })
    );
  }
  getImagenesInicio():  Observable<ImagenInicio[]>{
    return this.http.get<any>(this.endpoint + "/imagenInicios").pipe(map(response=>response._embedded.imagenInicios))
  }
  setImagenInicioDerecha(imagenInicio: ImagenInicio): Observable<ImagenInicio>{
    return this.http.patch<any>(this.endpoint + "/imagenInicios/1", imagenInicio);
  }
  setImagenInicioIzquierda(imagenInicio: ImagenInicio): Observable<ImagenInicio>{
    return this.http.patch<any>(this.endpoint + "/imagenInicios/2", imagenInicio);
  }

/* 
  //Eliminar una imagen de un producto determinado
  deleteImage(imagen: Imagen, id: string): void {
    console.log("en delete, Imagen: ", imagen, " , id: ", id)
    let nombreSinPunto = imagen.nombre.split(".")[0];
    let imagenRef = firebase
      .database()
      .ref()
      .child(`imagenes/${id}/${imagen.tipo}/${nombreSinPunto}`);
    let imagenStorageRef = firebase
      .storage()
      .ref()
      .child(`imagenes/${id}/${imagen.tipo}/${nombreSinPunto}`);
    imagenRef.remove();
    imagenStorageRef.delete();
  }

  //Metodo para borrar un nodo dela base de datos de Firebase
  deleteNode(id: string): void {
    let nodeRef = firebase.database().ref().child(`imagenes/${id}/`);
    nodeRef.remove();
    //Borrado de la carpeta correspondiente en Storage
    this.deleteFolderContents(`imagenes/${id}/`);
  }

  //Metodo para borrar una carpeta entera del Strorage
  deleteFolderContents(path: string) {
    const ref = firebase.storage().ref(path);
    ref
      .listAll()
      .then((dir) => {
        dir.items.forEach((fileRef) => {
          this.deleteFile(ref.fullPath, fileRef.name);
        });
        dir.prefixes.forEach((folderRef) => {
          this.deleteFolderContents(folderRef.fullPath);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //Eliminar un archivo del storage
  deleteFile(pathToFile: string, fileName: string) {
    const ref = firebase.storage().ref(pathToFile);
    const childRef = ref.child(fileName);
    childRef.delete();
  } */
}
