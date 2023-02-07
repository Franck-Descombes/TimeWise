import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'al-page-not-found',
  templateUrl: './page-not-found.component.html',
  styles: [
  ]
})
export class PageNotFoundComponent {

  constructor(private location: Location) { } // Inject location service.

  // redirect user to the previous page
  back() {
    this.location.back();
  }
}
