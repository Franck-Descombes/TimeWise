import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'al-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  // paths of protected routes
  prefix: string = 'app';
  dashboardPath: string = `${this.prefix}/dashboard`;
  planningPath: string = `${this.prefix}/planning`;
  workdayPath: string = `${this.prefix}/workday`;
  profilPath: string = `${this.prefix}/profil`;
  parametersPath: string = `${this.prefix}/parameters`;
  subscription: any;
  user: any;

  // Récupére l'utilisateur courant grâce à l'injection de du service auth.service.ts...
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.subscription = this.authService.user$.subscribe( // Ce service expose l’état de l’utilisateur courant à travers l’Observable user$...
      (user) => (this.user = user) // J'expose l'utilisateur courant pour le template sidenav.component.html
    );
  }

  public navigate(page: string): void {
    this.router.navigate([page]);
  }
  public isActive(page: string): boolean {
    return this.router.isActive(page, {
      paths: 'exact',
      queryParams: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }
}
