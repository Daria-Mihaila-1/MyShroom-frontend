import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {CookieService} from "ngx-cookie-service";

@Injectable()
export class AuthentificationInterceptor implements HttpInterceptor {

  constructor(private cookieService:CookieService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if(!(request.url.includes("/auth/login") && request.url.includes("/auth/register")) ) {


      const jwt = this.cookieService.get("token");
      console.log(jwt)
      request = request.clone( {withCredentials:true} );
      console.log("sunt in altceva nu in auth/login")
      console.log(request)
      console.log("Headers are set");
      return next.handle((request))
    }
    return next.handle(request);
  }
}
