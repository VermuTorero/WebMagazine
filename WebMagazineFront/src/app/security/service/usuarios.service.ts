import { Direccion } from './../../ecommerce/models/direccion';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
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

  getUsuarioFromId(id: string): Observable<Usuario>{
    return this.http.get<any>(this.endpointBack + "/usuarios/search/usuarioFromId/" + id)
  }

  getUsuariosAdmin(): Observable<Usuario[]> {   
    return this.http.get<any>(this.endpointBack + "/usuarios/search/usuariosAdmin").pipe(map(response=>response._embedded.usuarios));
  }

  getUsuariosWriter(): Observable<Usuario[]> {   
    return this.http.get<any>(this.endpointBack + "/usuarios/search/usuariosEscritores").pipe(map(response=>response._embedded.usuarios));
  }

  getUsuariosMember(): Observable<Usuario[]> {   
    return this.http.get<any>(this.endpointBack + "/usuarios/search/usuariosMiembros").pipe(map(response=>response._embedded.usuarios));
  }

  getUsuariosSuscritos(): Observable<Usuario[]> {   
    return this.http.get<any>(this.endpointBack + "/usuarios/search/usuariosSuscritos").pipe(map(response=>response._embedded.usuarios));
  }
  getUsuariosRegistrados(): Observable<Usuario[]> {   
    return this.http.get<any>(this.endpointBack + "/usuarios/search/usuariosRegistrados").pipe(map(response=>response._embedded.usuarios));
  }

  getUsuariosNotRegistered(): Observable<Usuario[]> {   
    return this.http.get<any>(this.endpointBack + "/usuarios/search/usuariosRegistradosNoConfirmados").pipe(map(response=>response._embedded.usuarios));
  }

  getUsuariosExpired(): Observable<Usuario[]> {   
    return this.http.get<any>(this.endpointBack + "/usuarios/search/usuariosExpirados").pipe(map(response=>response._embedded.usuarios));
  }

  getUsuariosDeleted(): Observable<Usuario[]> {   
    return this.http.get<any>(this.endpointBack + "/usuarios/search/usuariosEliminados").pipe(map(response=>response._embedded.usuarios));
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
    return this.http.get<any>(this.endpointBack + "/usuarios/search/getDireccionesFromUsuario").pipe(map(response=>response._embedded.direcciones));
  }

  postDireccion(direccion: Direccion): Observable <Direccion>{
    return this.http.post<any>(this.endpoint + "/direcciones/search/crearDireccion", direccion);
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
  deleteUsuario(): Observable<any>{
    return this.http.delete(this.endpointBack + "/usuarios/search/eliminarUsuario")
  }
  deleteUsuarioAdmin(user: Usuario): Observable<any>{
    return this.http.delete(this.endpointBack + "/usuarios/search/eliminarUsuarioAdmin/" + user.id)
  }
  postUsuario(user: Usuario): Observable<Usuario>{
    user.id = undefined;
    return this.http.post<any>(this.endpointBack + "/usuarios/search/nuevoUsuario", user);
  }
  postUsuarioAdmin(user: Usuario): Observable<Usuario>{
    user.id = undefined;
    return this.http.post<any>(this.endpointBack + "/usuarios/search/nuevoUsuarioAdmin", user);
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

  deleteDireccion(url: string): Observable<void>{
    return this.http.delete<any>(url);
  }

}
