import { Injectable } from '@angular/core';

import { Imagen } from '../models/imagen';
import { Observable, of } from 'rxjs';
import { firebaseConfig } from 'src/environments/firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as refer, onValue, set } from "firebase/database";

import { initializeApp } from "firebase/app";


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getDatabase(app);

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {
  urlImagen: string[] = [];

  constructor() { }

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

  subirImagen(file: File, id: string, tipo: string): Observable<string[]> {
    let arrayNombre = file.name.split(".");
    //Creo una referencia en el storage
    var storageRef = ref(storage, `imagenes/${arrayNombre[0]}`)
    //Subir el archivo al storage
    uploadBytes(storageRef, file).then(data => {
      getDownloadURL(storageRef).then((url)=>{
        this.urlImagen.push(url);
        set(refer(db, `imagenes/${arrayNombre[0]}`), {
          nombre: file.name,
            url: url,
            tipo: tipo
        });
      })
    });
    return of(this.urlImagen);
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
