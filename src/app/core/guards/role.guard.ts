import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  // vérifie si un user a le rôle nécessaire pour accéder à la page des paramètres en s’appuyant sur la méthode hasRole()
  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      map((user) => {
        return !!user && user.hasRole('EMPLOYEE');
      })
    );
  }
}
