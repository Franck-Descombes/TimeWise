import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [ // C’est dans ce tableau que l’on importe les routes de notre application :
  BrowserModule,
  CoreModule, // On importe d’abord nos “vraies” routes...
  AppRoutingModule // et ensuite la route générique en dernier !
 ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
