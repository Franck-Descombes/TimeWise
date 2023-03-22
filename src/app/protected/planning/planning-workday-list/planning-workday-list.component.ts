import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { WorkdaysService } from 'src/app/core/services/workdays.service';
import { User } from 'src/app/shared/models/user';
import { Workday } from 'src/app/shared/models/workday';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'al-planning-workday-list',
  templateUrl: './planning-workday-list.component.html',
  styles: [
  ]
})
export class PlanningWorkdayListComponent implements OnInit {
  /* Dans la méthode ngOnInit, nous avons ajouté un pipe catchError pour capturer l'erreur et renvoyer une observable vide avec of ([]).
  J'ai ajouté une console.error pour afficher l'erreur dans la console.
  Ensuite, j'ai modifié la souscription à la requête pour affecter les workdays récupérés ou un tableau vide en cas d'erreur.
  Cela permet d'avoir une gestion plus robuste des erreurs et d'afficher une information en cas d'échec de la récupération des workdays.
  */
  workdays: Workday[] = [];

  constructor(
    private authService: AuthService,
    private workdayService: WorkdaysService
  ) { }

  ngOnInit() {
    const user: User | null = this.authService.currentUser;
    if (user && user.id) {
      this.workdayService.getWorkdayByUser(user.id)
        .pipe(
          catchError(() => {
            console.error('Failed to get workdays');
            return of([]);
          })
        )
        .subscribe((workdays: Workday[]) => {
          this.workdays = workdays;
        });
    }
  }

  onWorkdayRemoved(workday: Workday) {
    this.workdayService
      .remove(workday)
      .subscribe(_ => this.workdays = this.workdays.filter(el => el.id !== workday.id));
  }
}

// BEFORE (also working)
// import { Component, OnInit } from '@angular/core';
// import { AuthService } from 'src/app/core/services/auth.service';
// import { WorkdaysService } from 'src/app/core/services/workdays.service';
// import { User } from 'src/app/shared/models/user';
// import { Workday } from 'src/app/shared/models/workday';

// @Component({
//   selector: 'al-planning-workday-list',
//   templateUrl: './planning-workday-list.component.html',
//   styles: [
//   ]
// })
// export class PlanningWorkdayListComponent implements OnInit {

//   workdays: Workday[] = []; // get workdays of a current user in a Tab.

//   constructor(
//     private authService: AuthService,
//     private workdayService: WorkdaysService) { }

//   ngOnInit() {
//     const user: User | null = this.authService.currentUser;
//     if (user && user.id) {
//       this.workdayService.getWorkdayByUser(user.id)
//         .subscribe((workdays: Workday[]) => {
//           this.workdays = workdays;
//         });
//     }
//   }

//   // MAJ des workdays à afficher
//   onWorkdayRemoved(workday: Workday) {
//     this.workdayService
//       .remove(workday) // retire celle qui a été supprimée de Firestore.
//       .subscribe(_ => this.workdays = this.workdays.filter(el => el.id !== workday.id)) // attribue a new Tab à workdays contenant les m^ workdays sans celle supprimée. 
//   }
// }