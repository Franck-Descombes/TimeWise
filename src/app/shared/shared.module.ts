
/* Ce module sert à factoriser les importations communes des autres modules.
(ajouter des formulaires dans différents modules nous obligerait à importer le module natif ReactiveFormsModule à chaque fois.
Grâce à la factorisation, il suffira de l’importer une seule fois dans le SharedModule ; il sera disponible pour tous les autres modules (ceux qui importent le SharedModule). */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBootstrapModule } from './modules/ngx-bootstrap.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ReactiveFormsModule } from '@angular/forms'; // Dédié à l’implémentation des formulaires

@NgModule({
  declarations: [
    SidenavComponent
  ],
  imports: [
    CommonModule,
    NgxBootstrapModule,
    ReactiveFormsModule
  ],
  exports: [  // step 1: réexporter le module CommonModule que nous voulons factoriser
    CommonModule,  // step 2: remplacer l’importation de CommonModule par ce SharedModule dans tous les modules concernés.
    NgxBootstrapModule,
    SidenavComponent,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
