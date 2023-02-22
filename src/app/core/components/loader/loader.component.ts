import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'al-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  isLoading$: Observable<boolean>; // flux émettant des booléens : true if loading 

  constructor(private loaderService: LoaderService) { }

  /* on affecte à isLoading$ le flux exposé par le loaderService, nommé isLoading$ également.
  1 ligne de code = un composant abonné à l’état global de l’application, en ce qui concerne le chargement.*/
  ngOnInit(): void {
    this.isLoading$ = this.loaderService.isLoading$;
  }
}
