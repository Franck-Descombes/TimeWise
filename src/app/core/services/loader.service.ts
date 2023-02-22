import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  // La classe BehaviorSubject permet de modéliser un état de nos données à travers toute l’application.

  // false par défaut. private => seules les autres méthodes du service peuvent modifier l’état des données.
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // Expose l’état des données du service au reste de l'app à travers isLoading$.
  readonly isLoading$: Observable<boolean> = this.isLoading.asObservable();

  // Modifie l’état des données, en passant true / false à l’Observable isLoading$. next() est liée aux Observables et permet d’émettre une nouvelle valeur dans le flux.
  setLoading(isLoading: boolean): void {
    this.isLoading.next(isLoading);
  }
}