import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginComponent } from './login/login.component';
import { LoginRoutingModule } from './login-routing.module'; // import du module de lazy loading

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    SharedModule,
    LoginRoutingModule // ajout du module de lazy loading
  ]
})
export class LoginModule { }
