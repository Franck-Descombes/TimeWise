import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

/* Série de modules (from NgxBootstrap) importés au même endroit, nous les réexportons ensuite :
AlertModule : Permet d’afficher des messages de confirmation, d’avertissement ou d’erreur à l’utilisateur, en fonction de ses interactions avec l’application.
BsDatepickerModule : Permet de sélectionner facilement une date au sein d’un petit calendrier.
BsDropdownModule : Permet d’implémenter rapidement des menus déroulants.
ModalModule : Ce module s’occupe de gérer des boîtes modales dans votre application.
PopoverModule : Permet d’afficher une petite bulle superposée sur la page.
ProgressbarModule : Affiche une barre de progression des pomodoros sur le tableau de bord.
Tous ces modules sont donc disponibles dans le SharedModule, mais pas ailleurs dans notre projet, car le SharedModule ne les réexporte pas dans l’ensemble de l’application !
*/

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AlertModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot()
  ],
  exports: [
    AlertModule,
    BsDatepickerModule,
    BsDropdownModule,
    ModalModule,
    PopoverModule,
    ProgressbarModule
  ]
})
export class NgxBootstrapModule { }
