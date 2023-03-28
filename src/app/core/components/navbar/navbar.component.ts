import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/core/services/layout.service';
import { User } from 'src/app/shared/models/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'al-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  homePath: string = 'home';
  loginPath: string = 'login';
  registerPath: string = 'register';
  user: User | null; // contient les infos de l'utilisateur si connecté, sinon null.
  private subscription: Subscription;

  constructor(
    private router: Router,
    private layoutService: LayoutService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.subscription = this.authService.user$.subscribe(user => this.user = user); // abonnement au service auth.
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); // désabonnenement lorsque le composant est détruit.
  }

  public isActive(page: string): boolean {
    return this.router.isActive(page, {
      paths: 'exact',
      queryParams: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
    return this.router.isActive(page, true); // Angular 11 ou <
  }

  public navigate(page: string): void {
    this.router.navigate([page]);
  }

  // appelle l’action correspondante dans le service de données.
  toggleSidenav() {
    this.layoutService.toggleSidenav();
  }

  logout() {
    this.authService.logout();
  }
}
