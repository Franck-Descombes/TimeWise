import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'al-dashboard-pomodoro-progress',
  templateUrl: './dashboard-pomodoro-progress.component.html',
  styleUrls: ['./dashboard-pomodoro-progress.component.scss']
})
export class DashboardPomodoroProgressComponent implements OnInit {

  currentProgress: number;
  percentage: number;
  
  // récupère les propriétés d’entrée (currentProgress & maxProgress) transmises par le composant parent (DashboardWorkdayComponent)
  @Input()
  set progress(progress: number) {
   this.currentProgress = progress;
   this.computePercentage();
  }
  
  @Input() maxProgress: number;

  ngOnInit() {}

  computePercentage() {
    // check if emitted values are != 0
    if (!this.currentProgress || !this.maxProgress) {
      this.percentage = 0;
      return;
    }
    // calcul du pourcentage de progression et MAJ de la loading bar
    this.percentage = Math.floor(this.currentProgress / this.maxProgress * 100);
  }
}
