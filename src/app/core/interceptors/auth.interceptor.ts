import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

// Cette classe intercepte toutes les requêtes HTTP sortantes et ajoute l'en-tête 'Content-Type' JSON.
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    // Intercepte la requête et ajoute l'en-tête 'Content-Type' JSON.
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isPublicRequest(request.url)) { // récupére l’URL de la requête envoyée depuis l’intercepteur, grâce à la propriété url de l’objet Request.
            request = this.addToken(request, localStorage.getItem('token')!);
        }
        request = this.addContentType(request); // Clone la requête passée en paramètre et ajoute l'en-tête JSON.

        return next.handle(request); // Passe la requête modifiée au prochain intercepteur (ou au backend) à l'aide du gestionnaire HTTP.
    }

    // (privée) Clone la requête existante et ajoute un en-tête 'Content-Type' JSON.
    private addContentType(request: HttpRequest<any>): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                'Content-Type': 'application/json'
            }
        });
    }

    // Ajout jeton d'authorisation à une requête, puis la retourne.
    private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    private isPublicRequest(url: string): boolean {
        return (url.includes('verifyPassword') || url.includes('signupNewUser'));
    }
}
