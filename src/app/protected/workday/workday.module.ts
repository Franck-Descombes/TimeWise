import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { WorkdayRoutingModule } from './workday-routing.module';
import { WorkdayComponent } from './workday/workday.component';
import { WorkdayFormComponent } from './workday-form/workday-form.component';
import { WorkdayFormDateComponent } from './workday-form-date/workday-form-date.component';
import { WorkdayFormTasksComponent } from './workday-form-tasks/workday-form-tasks.component';
import { WorkdayFormTasksItemComponent } from './workday-form-tasks-item/workday-form-tasks-item.component';
import { WorkdayFormTasksAddComponent } from './workday-form-tasks-add/workday-form-tasks-add.component';
import { WorkdayFormNotesComponent } from './workday-form-notes/workday-form-notes.component';

// chargement de la langue au niveau du module  qui contient le datepicker. 
import { defineLocale } from 'ngx-bootstrap/chronos'; // fonction qui prend en paramètre la langue à utiliser.
import { frLocale } from 'ngx-bootstrap/locale'; //la langue elle-même.
// utilise la fonction defineLocal en lui passant la langue que nous voulons afficher.
defineLocale('fr', frLocale); 


@NgModule({
  declarations: [
    WorkdayComponent,
    WorkdayFormComponent,
    WorkdayFormDateComponent,
    WorkdayFormTasksComponent,
    WorkdayFormTasksItemComponent,
    WorkdayFormTasksAddComponent,
    WorkdayFormNotesComponent,
  ],
  imports: [
    SharedModule,
    WorkdayRoutingModule
  ]
})
export class WorkdayModule { }
