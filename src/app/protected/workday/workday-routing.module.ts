import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkdayComponent } from './workday/workday.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: WorkdayComponent }
]

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkdayRoutingModule { }
