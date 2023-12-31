import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, finalize, switchMap, take, tap } from 'rxjs/operators';
import { LoginService } from '../service/login.service';

//Este interceptor analiza en cada llamada HTTP el token que se esta empleando (validez de  90 min). Cuando quedan menos de 30 min para su expiracion, lo renueva.
@Injectable()
export class TokenRefreshInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService) {}

  private isIntercepting = false;
  private interceptQueue: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isIntercepting) {
      this.isIntercepting = true;
      return next.handle(req).pipe(
        tap(() => {
          const expirationTime = this.loginService.getExpirationTime(); // Tiempo de expiración del token desde tu servicio de login
          const currentTime = new Date().getTime() / 1000; // Tiempo actual en segundos
          const refreshThreshold = 1800; //  Umbral de tiempo en segundos antes de que expire el token para solicitar la renovación
          if (expirationTime!=0 && expirationTime - currentTime < refreshThreshold) {
            this.loginService.refreshToken().subscribe(tokenDTO => {
              console.log('Solicitando refresco de token');
              sessionStorage.setItem('AuthToken', tokenDTO.token);
            });
          }
        }),
        finalize(() => {
          this.isIntercepting = false;
          this.processInterceptQueue();
        })
      );
    } else {
      return this.addToInterceptQueue().pipe(
        filter((value) => value),
        take(1),
        switchMap(() => next.handle(req)),
        finalize(() => {
          this.isIntercepting = false;
          this.processInterceptQueue();
        })
      );
    }
  }

  private addToInterceptQueue(): Observable<boolean> {
    return this.interceptQueue.pipe(
      filter((value) => !value),
      take(1),
      switchMap(() => {
        this.interceptQueue.next(true);
        return this.interceptQueue;
      })
    );
  }

  private processInterceptQueue() {
    this.interceptQueue.next(false);
  }
}
