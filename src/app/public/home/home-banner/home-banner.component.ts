import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'al-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.scss']
})
export class HomeBannerComponent {

  // loginPath: string = 'login';

  constructor(private router: Router) { }

  navigateToLogin(): void {
    this.router.navigate(['login']);
  }
}
