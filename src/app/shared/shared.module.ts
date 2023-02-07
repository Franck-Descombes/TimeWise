import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBootstrapModule } from './modules/ngx-bootstrap.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';

/* ce module sert à factoriser les importations communes des autres modules.
exemple : ajouter des formulaires dans plusieurs modules différents nous obligera à importer le module natif ReactiveFormsModule à chaque fois.
Grâce à la factorisation, il suffira d’importer une seule fois le ReactiveFormsModule dans le SharedModule ; il sera disponible pour tous les autres modules (ceux qui importent le SharedModule). */
// step 1: réexporter le module CommonModule que nous voulons factoriser
// step 2: remplacer l’importation du CommonModule par ce SharedModule dans tous les modules concernés.

@NgModule({
  declarations: [
    SidenavComponent
  ],
  imports: [
    CommonModule,
    NgxBootstrapModule
  ],
  exports: [
    CommonModule,
    NgxBootstrapModule,
    SidenavComponent
  ]
})
export class SharedModule { }
