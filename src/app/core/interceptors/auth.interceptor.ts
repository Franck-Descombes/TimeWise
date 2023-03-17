import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

// Cette classe intercepte toutes les requêtes HTTP sortantes et ajoute l'en-tête 'Content-Type' JSON.
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    // Intercepte la requête et ajoute l'en-tête 'Content-Type' JSON.
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = this.addContentType(request); // Clone la requête passée en paramètre et ajoute l'en-tête JSON.

        return next.handle(request); // Passe la requête modifiée au prochain intercepteur (ou au backend) à l'aide du gestionnaire HTTP.
    }

    // Fonction privée qui clone la requête existante et ajoute un en-tête 'Content-Type' JSON.
    private addContentType(request: HttpRequest<any>): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                'Content-Type': 'application/json'
            }
        });
    }
}
