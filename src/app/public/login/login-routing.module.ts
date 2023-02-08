// module de route dédié au lazy loading de LoginComponent.
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent } // URL vide dans le module de la route que l'on souhaite charger paresseusement.
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
