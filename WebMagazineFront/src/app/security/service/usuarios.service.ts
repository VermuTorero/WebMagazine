import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { Direccion } from 'src/app/ecommerce/models/direccion';
import { EmailDTO } from 'src/app/security/models/email-dto';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario';
import { Rol } from 'src/app/newsletter/models/Rol';
const EMAIL = 'email';
const ROL = 'rol';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

  endpoint: string = environment.urlAPI;
  endpointBack: string = environment.urlBack;

  getUsuarios(): Observable<Usuario[]> {   
    return this.http.get<any>(this.endpointBack + "/usuarios/search/usuarios").pipe(map(response=>response._embedded.usuarios));
  }

  getUsuariosFromUrls(urls: string[]): Observable<Usuario[]> {   
    const requests = urls.map(url => this.http.get<Usuario>(url));
    return forkJoin(requests);
  }

  getRolesFromEmail(email: string): Observable<Rol[]>{
    return this.http.get<any>(this.endpoint + "/usuarios/search/getRolesFromEmail/" + email).pipe(map(response=>response._embedded.roles));
  }

  getDireccionPorUrl(url: string): Observable<Direccion>{
    //para simplificar devolvemos la primera direccion, cambiar si se quiere implementar que un usuario tenga varias direcciones
    return this.http.get<any>(url).pipe(map(response=>response._embedded.direcciones[0]));
  }

  getDirecciones(): Observable<Direccion[]>{
    return this.http.get<any>(this.endpointBack + "/usuarios/search/getDireccionesFromUsuario");
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

  getUsuario(url: string): Observable<Usuario>{
    return this.http.get<Usuario>(url);
  }

  getId(p: any): string {
    let url = p._links.self.href;
    let trozos = url.split("/");
    return trozos[trozos.length - 1];
  }
  getUsuarioFromEmail(email: string): Observable<any>{
    let emailDto = new EmailDTO();
    emailDto.value = email;
    return this.http.post<any>(this.endpointBack + "/usuarios/search/usuarioFromEmail", emailDto)
  }
  getUsuarioFromToken(): Observable<any>{
    return this.http.get<any>(this.endpointBack + "/usuarios/search/usuarioFromToken")
  }
  public setUser(email: string): void {
    sessionStorage.removeItem(EMAIL);
    sessionStorage.setItem(EMAIL, email);
  }
  public setRol(rol: string): void {
    sessionStorage.removeItem(ROL);
    sessionStorage.setItem(ROL, rol);
  }
  getAutores(): Observable<Usuario[]>{
    return this.http.get<any>(this.endpointBack + "/usuarios/search/autores").pipe(map(response=>response._embedded.usuarios))
  }
  getAutor(id: string): Observable<Usuario>{
    return this.http.get<any>(this.endpointBack + "/usuarios/search/autores/" + id)
  }
  patchUsuario(user: Usuario): Observable<Usuario>{
    return this.http.patch<any>(this.endpointBack + "/usuarios/search/modificarUsuario" , user);
  }
  deleteUsuario(user: Usuario): Observable<any>{
    return this.http.delete(this.endpointBack + "/usuarios/search/eliminarUsuario/" + user.id)
  }
  postUsuario(user: Usuario): Observable<Usuario>{
    user.id = undefined;
    return this.http.post<any>(this.endpointBack + "/usuarios/search/nuevoUsuario", user);
  }
  getIsConfirmed(email: string): Observable<Usuario>{
    return this.http.get<any>(this.endpointBack + "/usuarios/search/isConfirmed/" + email)
  }
  setIsPaid(email: string): Observable<void> {
    return this.http.get<any>(this.endpointBack + "/usuarios/search/confirmarPago/" + email);
  }
  patchUsuarioRenovado(user: Usuario): Observable<Usuario>{
    return this.http.patch<any>(this.endpointBack + "/usuarios/search/renovarUsuario" , user);
  }
  cambiarPassword(user: Usuario): Observable<Usuario>{
    return this.http.post<any>(this.endpointBack + "/usuarios/search/cambiarPassword" , user );
  }
  deleteUsuarioFromToken(): Observable<void>{
    return this.http.delete<any>(this.endpointBack + "/usuarios/search/deleteUsuarioFromToken");
  }
}
