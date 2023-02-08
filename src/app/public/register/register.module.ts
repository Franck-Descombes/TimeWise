import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RegisterRoutingModule } from "./register-routing.module";
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    SharedModule,
    RegisterRoutingModule // nous chargeons ce module en lazy.
  ]
})
export class RegisterModule { }
