import { Component, OnInit, Input } from '@angular/core';
import { Workday } from 'src/app/shared/models/workday';

@Component({
  selector: 'al-dashboard-workday',
  templateUrl: './dashboard-workday.component.html',
  styleUrls: ['./dashboard-workday.component.scss']
})
export class DashboardWorkdayComponent implements OnInit {
  @Input() workday: Workday;
  isPomodoroActive: boolean;

  constructor() { }

  ngOnInit(): void {
    this.isPomodoroActive = false; // lorsque le user arrive sur le dashboard, le pomodoro n’est pas en train de s’exécuter.
  }

  // 3 méthodes qui permettrons respectivement de :
  startPomodoro() {
    this.isPomodoroActive = true;
  }

  cancelPomodoro() {
    this.isPomodoroActive = false;
  }

  completePomodoro() {
    this.isPomodoroActive = false;
  }
}
