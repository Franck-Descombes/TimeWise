import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  // suppression de la redondance du type générique en utilisant l'inférence de type de TypeScript.
  private isSidenavCollapsed = new BehaviorSubject<boolean>(false); // définition de l'état.
  readonly isSidenavCollapsed$ = this.isSidenavCollapsed.asObservable(); // exposition de l'état sous la forme d'un Observable.

  constructor() {}

  //  la propriété value de la classe BehaviorSubject contient la valeur ; on utilise « ! » pour intervertir le booléen,
  toggleSidenav() {
    //  on émet cette nouvelle valeur dans notre état, grâce à la méthode next().
    this.isSidenavCollapsed.next(!this.isSidenavCollapsed.value);
  }
}



// CODE DE SIMON :
// export class LayoutService {
//   private isSidenavCollapsed: BehaviorSubject<boolean> =
//     new BehaviorSubject<boolean>(false);
//   readonly isSidenavCollapsed$: Observable<boolean> =
//     this.isSidenavCollapsed.asObservable(); //

//   constructor() {}

//   toggleSidenav() {
//     this.isSidenavCollapsed.next(!this.isSidenavCollapsed.value);
//   }
// }


// ALTERNATIVE 1 :
// toggleSidenav() {
//   if (this.isSidenavCollapsed.value === false) {
//     this.isSidenavCollapsed.next(true);
//   } else {
//     this.isSidenavCollapsed.next(false);
//   }
// }


// ALTERNATIVE 2 :
// public toggleSidenav() {
//   const currentValue = this.isSidenavCollapsed.value;
//   this.isSidenavCollapsed.next(!currentValue);
//   }


/* ALTERNATIVE 3 :
// Ici, on supprime la propriété en lecture seule isSidenavCollapsed$
private isSidenavCollapsed$ = new BehaviorSubject<boolean>(false);

toggleSidenav() {
  this.isSidenavCollapsed$.next(!this.isSidenavCollapsed$.value);
}

// Ici, on ajoute une méthode get pour la propriété isSidenavCollapsed. Cette méthode permet de cacher l'implémentation interne du BehaviorSubject en exposant seulement un Observable.
// Cela permet de protéger l'objet BehaviorSubject et d'éviter qu'il soit modifié de manière inattendue depuis l'extérieur du service.
get isSidenavCollapsed() {
  return this.isSidenavCollapsed$.asObservable();
}
}
*/

// AUTRE
//   readonly isSidenavCollapsed$ = new BehaviorSubject<boolean>(false);

//   toggleSidenav() {
//     this.isSidenavCollapsed$.next(!this.isSidenavCollapsed$.value);
//   }

//   get isSidenavCollapsed() {
//     return this.isSidenavCollapsed$.value;
//   }
// }
