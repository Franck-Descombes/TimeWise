import { Component, Input, OnInit } from '@angular/core';
import { Workday } from 'src/app/shared/models/workday';
import { Subject, interval, Observable, of } from 'rxjs';
import { takeUntil, map, takeWhile, delay } from 'rxjs/operators';
import { Task } from 'src/app/shared/models/task';
import { WorkdaysService } from 'src/app/core/services/workdays.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'al-dashboard-workday',
  templateUrl: './dashboard-workday.component.html',
  styleUrls: ['./dashboard-workday.component.scss']
})
export class DashboardWorkdayComponent implements OnInit {
  @Input() workday: Workday;
  isWorkdayComplete: boolean;
  isPomodoroActive: boolean;
  currentTask: Task | undefined;

  // Initialisation des Subjects et des flux pour le pomodoro
  startPomodoro$: Subject<string>;
  cancelPomodoro$: Subject<string>;
  completePomodoro$: Subject<string>;
  currentProgress: number;
  maxProgress: number;
  pomodoro$: Observable<number>;

  constructor(
    private workdaysService: WorkdaysService,
    private authService: AuthService) { }

  ngOnInit(): void {
    // Vérification si la journée de travail est terminée
    this.isWorkdayComplete = (this.getCurrentTask() === undefined);
    // this.isWorkdayComplete = (this.task === undefined);
    this.isPomodoroActive = false;

    // Initialisation des Subjects pour gérer le flux du pomodoro
    this.startPomodoro$ = new Subject();
    this.cancelPomodoro$ = new Subject();
    this.completePomodoro$ = new Subject();

    // Initialisation de la progression actuelle et de la durée maximale d'un pomodoro
    this.currentProgress = 0;
    // this.maxProgress = this.authService.currentUser.pomodoroDuration;
    const user: User | null = this.authService.currentUser;
    if (user) {
      this.maxProgress = user.pomodoroDuration; // définition de la durée exacte d'un pomodoro
    }

    // Initialisation du flux pomodoro
    this.pomodoro$ = interval(1000).pipe(
      takeUntil(this.cancelPomodoro$), // désabonnements des flux : Opérateur takeUntil(), et sur les Subjects cancelPomodoro$ et completePomodoro$.
      takeUntil(this.completePomodoro$),
      takeWhile(progress => progress <= this.maxProgress), // se désabonne du flux dès que le pomodoro se termine.
      map(x => x + 1) // map() transforme chaque valeur émise par un flux. On a bien la val 1 après 1 sec, puis 2 après 2 sec, etc.
    );
  }

  // Méthode pour récupérer la tâche en cours
  // get task(): Task | undefined {
  //   return this.workday.tasks.find((task: Task) => task.todo > task.done);
  // }
  getCurrentTask(): Task | undefined {
    return this.workday.tasks.find(task => task.todo > task.done); // find() retourne le premier élément du tableau qui respecte la condition passée en paramètre (sinon, undefined).
  }

  // Méthode pour démarrer un Pomodoro
  startPomodoro() {
    this.isPomodoroActive = true;
    this.startPomodoro$.next('start');
    // Souscrire à l'événement pour récupérer la progression en temps réel
    this.pomodoro$.subscribe((currentProgress: number) => {
      this.currentProgress = currentProgress; // MAJ de la progression
      // Vérifier si le Pomodoro est terminé
      if (currentProgress === this.maxProgress) {
        // Calculer le nombre de Pomodoros terminés
        const completedPomodoros = currentProgress / 1500;

        // Si le nombre de Pomodoros terminés est égal au nombre maximal
        if (completedPomodoros === this.maxProgress) {
          // Attendre 500ms avant de déclencher la fin du Pomodoro
          of(0).pipe(delay(500)).subscribe(_ => this.completePomodoro());
        }
      }
    });
  }

  // Méthode pour annuler le pomodoro
  cancelPomodoro() {
    this.isPomodoroActive = false;
    this.cancelPomodoro$.next('cancel')
  }

  // Méthode pour terminer le pomodoro
  completePomodoro() {
    this.completePomodoro$.next('complete'); // Émettre un événement
    this.isPomodoroActive = false; // Désactiver le pomodoro
    this.currentTask = this.getCurrentTask(); // Récupérer la tâche courante

    if (this.currentTask) {
      this.currentTask.done++; // Incrémenter le nombre de pomodoros terminés
    }

    this.workdaysService.update(this.workday).subscribe(); // MAJ des données de la journée de travail

    this.isWorkdayComplete = (this.getCurrentTask() === undefined); // Vérifier si la journée de travail est terminée
  }
}


