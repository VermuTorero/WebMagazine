import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenDTO } from '../models/token-dto';
import { AuthReq } from '../models/auth-req';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';
import { Usuario } from '../models/usuario';
const USER_KEY = "email";
const ROLE_KEY = "rol";


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  endpoint: string = environment.urlBack;
  isLoggedFlag$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isAdminFlag$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: HttpClient,
    private tokenService: TokenService) { }

  login(user: string, password: string): Observable<TokenDTO>{
    let authReq = new AuthReq(user, password);
    return this.http.post<any>(this.endpoint + "/oauth/authenticate", authReq);
  }

  signin(usuario: Usuario): Observable<Usuario>{
    return this.http.post<any>(this.endpoint + "/api/usuarios", usuario);
  }
  
  getIsLoggedFlagObs(): Observable<boolean> {
    if (this.tokenService.getToken()) {
      this.setIsLoggedFlagObs(true);
    }
    return this.isLoggedFlag$.asObservable();
  }

  setIsLoggedFlagObs(isLoged: boolean) {
    this.isLoggedFlag$.next(isLoged);
  }

  getIsAdminFlagObs(): Observable<boolean> {
    if (this.getRol() == "ROLE_ADMIN") {
      this.setIAdminFlagObs(true);
    }
    return this.isAdminFlag$.asObservable();
  }

  setIAdminFlagObs(isAdmin: boolean) {
    this.isAdminFlag$.next(isAdmin);
  }

  getRol(): string | null{
    return sessionStorage.getItem(ROLE_KEY);
  }
  refreshToken(): Observable<TokenDTO>{
    return this.http.get<TokenDTO>(this.endpoint + "/oauth/renovarToken");
  }
  getExpirationTime(): number {
    const token = sessionStorage.getItem('AuthToken');
    if (token) {
      const tokenData = JSON.parse(atob(token.split('.')[1])); // Decodificar el token JWT
      return tokenData.exp; // Obtener el tiempo de expiración del token desde el payload decodificado
    }
    return 0;
  }
  passwordRecovery(email: string): Observable<any>{
    return this.http.get<any>(this.endpoint + "usuarios/search/enviarCorreoOlvidoPassword/" + email );
  }

}
