import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParametersComponent } from './parameters/parameters.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ParametersComponent }
]

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametersRoutingModule { }
