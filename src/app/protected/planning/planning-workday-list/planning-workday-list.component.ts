import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { WorkdaysService } from 'src/app/core/services/workdays.service';
import { User } from 'src/app/shared/models/user';
import { Observable } from 'rxjs';
import { Workday } from 'src/app/shared/models/workday';

@Component({
  selector: 'al-planning-workday-list',
  templateUrl: './planning-workday-list.component.html',
  styles: [
  ]
})
export class PlanningWorkdayListComponent implements OnInit {

  workdays: Workday[]; // get workdays of a current user in a Tab.

  constructor(
    private authService: AuthService,
    private workdayService: WorkdaysService) { }

  ngOnInit() {
    const user: User | null = this.authService.currentUser;
    if (user && user.id) {
      this.workdayService.getWorkdayByUser(user.id).subscribe((workdays: Workday[]) => this.workdays = workdays);
    }
  }

  // MAJ des workdays à afficher, en retirant celle qui a été supprimée côté Firestore.
  // Pour cela, on attribue à la propriété workdays un nouveau tableau, contenant les mêmes workdays sans celle que l’on vient de supprimer. 
  onWorkdayRemoved(workday: Workday) {
    this.workdayService.remove(workday)
      .subscribe(_ => this.workdays = this.workdays.filter(el => el.id !== workday.id))
  }
  // // OLD VERSION
  // onWorkdayRemoved(workday: Workday) {
  //   this.workdayService.remove(workday)
  //   .subscribe(_ => {
  //    console.log(`${workday.id} has been removed from Firestore !`);
  //   })
  //  }
}