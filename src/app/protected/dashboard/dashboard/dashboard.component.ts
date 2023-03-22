import { Component, OnInit } from '@angular/core';
import { DateService } from 'src/app/core/services/date.service';

@Component({
  selector: 'al-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  currentDate: string; // sauvegarde la date formatée

  constructor(private dateService: DateService) { }

  ngOnInit(): void {
    this.currentDate = this.dateService.getDisplayDate(new Date());
  }
}
