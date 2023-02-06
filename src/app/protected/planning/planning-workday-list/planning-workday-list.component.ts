import { Component, OnInit } from '@angular/core';
import { Observable, of } from "rxjs"; // 'of' : créer un Observable à partir d’une variable quelcqonque.
import { delay } from "rxjs/operators"; // 'delay' permet de différer la diffusion d’une valeur au sein d'un flux.

@Component({
  selector: 'al-planning-workday-list',
  templateUrl: './planning-workday-list.component.html',
  styles: [
  ]
})
export class PlanningWorkdayListComponent implements OnInit {

  // Observable (propriété) convention => '$' 
  workdays: { dueDate: string, doneTasks: number, remainingTasks: number }[];
  workdays$: Observable<{ dueDate: string, doneTasks: number, remainingTasks: number }[]>;

  constructor() { }

  ngOnInit() {
    //  Tab 'workdays' contenant la liste des journées de travail initialement prévues.
    this.workdays = [
      { dueDate: 'Lundi', doneTasks: 2, remainingTasks: 3 },
      { dueDate: 'Mardi', doneTasks: 0, remainingTasks: 2 },
      { dueDate: 'Mercredi', doneTasks: 0, remainingTasks: 1 }
    ];

    // génère un flux contenant toutes les journées de travail déclarées au-dessus.
    this.workdays$ = of(this.workdays).pipe(delay(1000));
  }

  /* le composant parent lie la méthode onWorkdayRemoved (chargée de gérer des événements) avec les valeurs émises par le composant fils.
  Angular passe automatiquement l’argument $event à la méthode de gestionnaire d’événement. Ce paramètre $event contient la valeur émise par le composant fils.*/
  onWorkdayRemoved(dueDate: string) {
    this.workdays = this.workdays.filter(workday =>
      !dueDate.includes(workday.dueDate)
    );
    this.workdays$ = of(this.workdays);
  }
}
