import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      // Transforme la variable d’entrée user en un booléen grâce à l’opération !!user.
      map((user) => !!user), // !!user vaudra soit vrai, soit faux !
      tap((isLogged) => {
        if (!isLogged) {
          this.router.navigate(['/login']);
          return false; // user not authenticated => redirect back to login page
        }

        return true; // user authenticated
      })
    );
  }

  // Same as canActivate() but dedicated to child routes.
  canActivateChild(): Observable<boolean> {
    return this.canActivate();
  }
}
