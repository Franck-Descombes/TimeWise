import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { PublicRoutingModule } from './public-routing.module';
import { HomeModule } from './home/home.module';

//   IMPORTANT : supprimer l’importation des modules paresseux depuis le module Public. Sinon ils seront chargés au démarrage.
@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    PublicRoutingModule,
    HomeModule
  ]
})
export class PublicModule { }
