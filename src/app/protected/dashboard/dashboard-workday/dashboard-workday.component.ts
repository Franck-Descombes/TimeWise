import { Component, OnInit, Input } from '@angular/core';
import { delay, interval, map, Observable, of, Subject, takeUntil, takeWhile } from 'rxjs';
import { Task } from 'src/app/shared/models/task';
import { Workday } from 'src/app/shared/models/workday';

@Component({
  selector: 'al-dashboard-workday',
  templateUrl: './dashboard-workday.component.html',
  styleUrls: ['./dashboard-workday.component.scss']
})
export class DashboardWorkdayComponent implements OnInit {
  @Input() workday: Workday;
  isPomodoroActive: boolean;
  currentTask: Task | undefined;

  // Initialisation des flux 
  startPomodoro$: Subject<string>;
  cancelPomodoro$: Subject<string>;
  completePomodoro$: Subject<string>;
  currentProgress: number;
  maxProgress: number;
  pomodoro$: Observable<number>;

  constructor() { }

  ngOnInit(): void {
    this.isPomodoroActive = false;
    this.startPomodoro$ = new Subject();
    this.cancelPomodoro$ = new Subject();
    this.completePomodoro$ = new Subject();
    this.currentProgress = 0
    this.maxProgress = 5; // valeur paramètrable par le user employee google.
    this.pomodoro$ = interval(1000).pipe(// interval() crée un new flux qui émet les valeurs toutes les x millisec.
      takeUntil(this.cancelPomodoro$), // désabonnements des flux : Opérateur takeUntil(), et sur les Subjects cancelPomodoro$ et completePomodoro$.
      takeUntil(this.completePomodoro$),
      takeWhile(progress => progress <= this.maxProgress), // se désabonne du flux dès que le pomodoro se termine.
      map(x => x + 1));// map() transforme chaque valeur émise par un flux. On a bien la val 1 après 1 sec, puis 2 après 2 sec, etc.
  }

  // GPT SUGGESTION
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

  completePomodoro() {
    this.isPomodoroActive = false;
    this.completePomodoro$.next('complete')

    // step 1 : retrieve current task
    this.currentTask = this.getCurrentTask();

    // step 2 : increment current task
    if (this.currentTask) {
      this.currentTask.done++;
    }
  }

  getCurrentTask(): Task | undefined {
    return this.workday.tasks.find(task => task.todo > task.done)
  }

  cancelPomodoro() {
    this.isPomodoroActive = false;
    this.cancelPomodoro$.next('cancel')
  }
}
