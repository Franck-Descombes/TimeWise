import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ProtectedModule } from '../protected/protected.module';
import { PublicModule } from '../public/public.module';
import { FooterComponent } from './components/footer/footer.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ToastrComponent } from './components/toastr/toastr.component';
import { HttpClientModule } from '@angular/common/http';

// Les importations
@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    PageNotFoundComponent,
    LoaderComponent,
    ToastrComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    PublicModule,
    ProtectedModule,
    AlertModule.forRoot(), // disponible au niveau de ce module (CoreModule).
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    PageNotFoundComponent,
    LoaderComponent,
    ToastrComponent
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(`CoreModule is already loaded from.`);
    }
  }
}
