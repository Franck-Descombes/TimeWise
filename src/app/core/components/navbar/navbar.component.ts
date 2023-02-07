import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'al-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  homePath: string = 'home';
  loginPath: string = 'login';
  registerPath: string = 'register';

  constructor(private router: Router) { } // Router injection

  ngOnInit() { }

  public isActive(page: string): boolean {
    return this.router.isActive(page, { paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored' });  // Angular 12 ou >
    return this.router.isActive(page, true);  // Angular 11 ou < 
  }

  public navigate(page: string): void {
    this.router.navigate([page]);
  }

}
