import { Component, Input, OnInit } from '@angular/core';
import { delay, interval, map, Observable, of, Subject, takeUntil, takeWhile } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { WorkdaysService } from 'src/app/core/services/workdays.service';
import { Task } from 'src/app/shared/models/task';
import { User } from 'src/app/shared/models/user';
import { Workday } from 'src/app/shared/models/workday';

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

  // Initialisation des flux 
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
    this.isWorkdayComplete = (this.getCurrentTask() === undefined);
    this.isPomodoroActive = false;
    this.startPomodoro$ = new Subject();
    this.cancelPomodoro$ = new Subject();
    this.completePomodoro$ = new Subject();
    this.currentProgress = 0
    const user: User | null = this.authService.currentUser;
    if (user) {
      this.maxProgress = user.pomodoroDuration; // définition de la durée exacte d'un pomodoro
    } this.pomodoro$ = interval(1000).pipe(// interval() crée un new flux qui émet les valeurs toutes les x millisec.
      takeUntil(this.cancelPomodoro$), // désabonnements des flux : Opérateur takeUntil(), et sur les Subjects cancelPomodoro$ et completePomodoro$.
      takeUntil(this.completePomodoro$),
      takeWhile(progress => progress <= this.maxProgress), // se désabonne du flux dès que le pomodoro se termine.
      map(x => x + 1));// map() transforme chaque valeur émise par un flux. On a bien la val 1 après 1 sec, puis 2 après 2 sec, etc.
  }

  // si ce getter retourne undefined, c’est qu’aucune tâche non terminée n’existe, donc que l’utilisateur a achevé sa journée de travail.
  getCurrentTask(): Task | undefined {
    return this.workday.tasks.find(task => task.todo > task.done) // find() retourne le premier élément du tableau qui respecte la condition passée en paramètre (sinon, undefined).
  }

  startPomodoro() {
    this.isPomodoroActive = true;
    this.startPomodoro$.next('start');// emit a value in the subject (doesn't matter which one)

    this.pomodoro$.subscribe((currentProgress: number) => {// à chaque seconde écoulée depuis le début du pomodoro, on actualise la valeur de la propriété currentProgress.
      this.currentProgress = currentProgress;

      if (currentProgress === this.maxProgress) {
        const completedPomodoros = currentProgress / 1500;
        if (completedPomodoros === this.maxProgress) {
          of(0).pipe(delay(500)).subscribe(_ => this.completePomodoro()); // possible erreur de compilation en raison du paramètre _ (implicitement de type any).


        }
      }
    });
  }

  cancelPomodoro() {
    this.isPomodoroActive = false;
    this.cancelPomodoro$.next('cancel')
  }

  completePomodoro() {
    this.completePomodoro$.next('complete');
    this.isPomodoroActive = false;

    // 1.  Récupérer la tâche courante, sur laquelle l’utilisateur est en train d’effectuer son pomodoro.
    this.currentTask = this.getCurrentTask();

    // 2. Incrémenter la tâche courante que l’on vient de récupérer de 1, au niveau du nombre de pomodoros terminés. 
    if (this.currentTask) {
      this.currentTask.done++; // ...information contenue dans la propriété done d’une tâche.
    }
    // 3 : Vérifier si la journée de travail est terminée.
    this.isWorkdayComplete = (this.getCurrentTask === undefined);
    // 4. Mettre à jour la journée de travail côté backend.
    this.workdaysService.update(this.workday).subscribe();
  }
  
  // completePomodoro() {
  //   this.completePomodoro$.next('complete');
  //   this.isPomodoroActive = false;

  //   // Étape n°1 : Incrémenter la tâche courante.
  //   this.task.done++;

  //   // Étape n°2 : Vérifier si la journée de travail est terminée.
  //   this.isWorkdayComplete = (this.task === undefined);

  //   // Étape n°3 : Mettre à jour la journée de travail côté backend.
  //   this.workdaysService.update(this.workday).subscribe();
  // }
}
