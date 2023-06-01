import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginService } from '../service/login.service';

@Injectable()
export class TokenRefreshInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(() => {
        const expirationTime = this.loginService.getExpirationTime(); // Obtén el tiempo de expiración del token desde tu servicio de login
        const currentTime = new Date().getTime() / 1000; // Obtén el tiempo actual en segundos
        const refreshThreshold = 300; // Umbral de tiempo en segundos antes de que expire el token para solicitar la renovación
        console.log("EXPIRATION TIME", expirationTime);
        console.log("CURRENT TIME", currentTime);
        console.log("TIEMPO REFRENCO", expirationTime)
        console.log("RESTA TIEMPO: ", expirationTime - currentTime)
        if (expirationTime - currentTime < refreshThreshold) {
          this.loginService.refreshToken().subscribe(tokenDTO => {
            console.log('Solicitando refresco de token');
            sessionStorage.setItem('AuthToken', tokenDTO.token);
          });
        }
      })
    );
  }
}
