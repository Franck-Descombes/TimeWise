import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningComponent } from './planning/planning.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: PlanningComponent }
]

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanningRoutingModule { }
