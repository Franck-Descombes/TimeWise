import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Workday } from 'src/app/shared/models/workday';

@Component({
  selector: 'al-planning-workday-item',
  templateUrl: './planning-workday-item.component.html',
  styles: [
  ]
})
export class PlanningWorkdayItemComponent implements OnInit {

  @Input() workday: Workday; // nouveau, tout le reste a été nettoyé :)
  @Output() workdayRemoved = new EventEmitter<Workday>();

  constructor(private router: Router) { }

  ngOnInit() { }

  /* la méthode goWorkday à deux rôles distincts.
D’abord, celui d’effectuer une redirection vers la page d’édition d’une journée de travail.
Mais également de passer l’information sur la journée de travail à éditer*/
  goWorkday(arg0: Workday) {
    this.router.navigate(
      ['app/workday'],
      {
        queryParams: {
          date: this.workday.dueDate
        }
      }
    );
  }

  // On remonte déjà la journée de travail à supprimer.
  removeWorkday(workday: Workday) {
    this.workdayRemoved.emit(workday); // dueDate devient workday !
  }
}

/* AVANT ________________________________________________________________________________________
Lors de la détection de changement, que ce soit avec les setters ou avec NgOnChanges, Angular utilise l’opérateur “===” pour détecter les changements.
Pour les valeurs simples comme les nombres et les chaînes de caractères, cela fonctionne très bien. Cependant, il faut être attentif si vous passez un tableau ou un objet.
En effet, si vous ajoutez un élément dans un tableau depuis le composant parent, ce nouvel élément ne sera pas pris en compte par Angular,
car la référence du tableau n’a pas changé ! Pour que le changement soit détecté par Angular, vous devez réaffecter ce tableau : myArray = sameArrayWithNewValue;
Ce n’est pas très compliqué, mais il faut le savoir. Cela permet d’éviter des mauvaises surprises par la suite.
/*
@Input() dueDate: string;
@Input() doneTasks: number | string;
@Input() remainingTasks: number | string;

// On utilise la généricité de TypeScript pour indiquer que cet event émettra des strings (“Lundi”, “Mardi”, etc).
@Output() workdayRemoved = new EventEmitter<string>(); // Donnée qui sera émise à l’extérieur par le composant.

// Prend en param ttes les modifs sur les prop d’entrée ; ces "modifications" sont passés dans le param 'changes' (Tab d’objet de type SimpleChanges).
ngOnChanges(changes: SimpleChanges) {
   for (const propName in changes) {
    this.update(propName, changes[propName].currentValue);
   }
  }
  // Prend en param une clef et une valeur, correspondant aux propriétés interceptées par NgOnChanges.
  update(propName: string, propValue: string|number) {

    switch (propName) {
      case 'dueDate': {
        if ('Lundi' === propValue) { this.dueDate += ' (Aujourd\'hui)'; }
        break;
      }
      case 'doneTasks': {
        if (0 === propValue) { this.doneTasks = 'Aucune tâche terminé.'; }
        break;
    }
    case 'remainingTasks': {
      if (0 === propValue) {
        this.remainingTasks = 'Journée de travail terminée !';
      }
      break;
    }
    default: {
      break;
    }
  }
}
// émet un évènement avec la date concernée en paramètre, à chaque clic.
// Permet de récupérer cette date dans le composant parent pour savoir quelle journée de travail doit être retirée de la liste.
removeWorkday(dueDate: string) {
  // Vous ne pouvez passer qu’une seule valeur à la méthode nommée « emit ». Si vous avez plus d’une valeur à émettre dans un événement, passer par un objet à la place.
  this.workdayRemoved.emit(dueDate);
}
}
___________________________________________________________________________________________*/



// INTERCEPTION DE CHANGEMENTS AVEC UN SETTER :
// export class PlanningWorkdayItemComponent {
//   currentWorkday: { dueDate: string, doneTasks: number, remainingTasks: number } // nom utilisé en interne par notre composant.

//   // intercepter et agir sur nos propriétés d’entrées.
//   /* Nom de la prop d’entrée appelé par le composant parent sera le nom du setter (workday). Cette méthode prend en param une journée de travail.
//  Les valeurs qui arrivent en entrée de ce composant sont envoyées en param du setter.*/
//   @Input()
//   set workday(workday: { dueDate: string, doneTasks: number, remainingTasks: number }) {
//     this.currentWorkday = workday || {};

//     if ('Lundi' === workday.dueDate) {
//       this.currentWorkday.dueDate += `(Aujourd'hui)`;
//     }
//   }
//   get workday() { return this.currentWorkday; } // masquer le nom de la propriété intermédiaire utilisé en interne.
// }
