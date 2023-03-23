import { Component, OnInit } from '@angular/core';
import { DateService } from 'src/app/core/services/date.service';
import { User } from 'src/app/shared/models/user';
import { Workday } from 'src/app/shared/models/workday';
import { AuthService } from 'src/app/core/services/auth.service';
import { WorkdaysService } from 'src/app/core/services/workdays.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'al-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  currentDate: string; // sauvegarde la date formatée
  currentUser: User | null;
  workday$: Observable<Workday | null>;

  constructor(
    private authService: AuthService,
    private workdaysService: WorkdaysService,
    private dateService: DateService) { }

  ngOnInit(): void {
    this.currentDate = this.dateService.getDisplayDate(new Date()); // get current date
    this.currentUser = this.authService.currentUser; // get current user from auth service
    if (this.currentUser && this.currentUser.id) {
      this.workday$ = this.workdaysService.getWorkdayByDate(this.currentDate, this.currentUser.id);// use WorkdayService to get list of tasks associated.
    }
  }
}
