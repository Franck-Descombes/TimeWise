import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilComponent } from './profil/profil.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [ 
  { path: '', component: ProfilComponent }
]

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilRoutingModule { }
