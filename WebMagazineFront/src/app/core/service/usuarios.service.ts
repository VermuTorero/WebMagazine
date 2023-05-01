import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Direccion } from 'src/app/ecommerce/models/direccion';
import { Usuario } from 'src/app/newsletter/models/usuario';
import { environment } from 'src/environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

  endpoint: string = environment.urlAPI;

  getUsuarios(): Observable<Usuario[]> {   
    return this.http.get<any>(this.endpoint + "/usuarios").pipe(map(response=>response._embedded.usuarios));
  }

  getDireccionPorUrl(url: string): Observable<Direccion>{
    //para simplificar devolvemos la primera direccion, cambiar si se quiere implementar que un usuario tenga varias direcciones
    return this.http.get<any>(url).pipe(map(response=>response._embedded.direcciones[0]));
  }

  extraerUrlDireccionUsuario(usuario: any): string{
    return usuario._links.direcciones.href
  }

  extraerUrlUsuario(usuario: any): string{
    return usuario._links.usuario.href
  }

  extraerUrlDireccion(direccion: any): string {
    return direccion._links.self.href
  }

}
