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
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

// Ce module contient les composants, services et intercepteurs de base pour l'application.
// Il est importé par AppModule et ne doit être importé qu'une seule fois.
// Il fournit des éléments de l'interface utilisateur tels que la barre de navigation, le pied de page, le composant de chargement et le composant Toastr pour les messages de notification.
// Il importe également les modules publics et protégés qui contiennent les composants et services spécifiques aux fonctionnalités.
// Ce module utilise l'intercepteur AuthInterceptor pour ajouter des jetons d'authentification aux requêtes HTTP sortantes.
@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    PageNotFoundComponent,
    LoaderComponent,
    ToastrComponent,
  ],
  imports: [
    CommonModule, // Ce module fournit les directives communes telles que *ngIf et *ngFor.
    HttpClientModule, // Ce module permet les appels HTTP pour récupérer des données à partir d'un serveur.
    BrowserAnimationsModule, // Ce module fournit les animations de base pour les éléments de l'interface utilisateur.
    PublicModule, // Ce module contient les composants et services pour les fonctionnalités publiques de l'application.
    ProtectedModule, // Ce module contient les composants et services pour les fonctionnalités protégées de l'application.
    AlertModule.forRoot(), // Ce module permet d'utiliser le composant d'alerte de ngx-bootstrap dans ce module (CoreModule).
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    PageNotFoundComponent,
    LoaderComponent,
    ToastrComponent
  ],
  providers: [
    // Ce fournisseur ajoute l'intercepteur d'authentification pour ajouter des jetons d'authentification aux requêtes HTTP sortantes.
    // Il est important que l'ordre de déclaration soit respecté pour que l'intercepteur fonctionne correctement.
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true // Permet de fournir plusieurs intercepteurs pour ce fournisseur HTTP_INTERCEPTORS.
    }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    // Empêche l'importation de CoreModule plus d'une fois.
    if (parentModule) {
      throw new Error(`CoreModule has already been loaded. Import CoreModule only in AppModule.`);
    }
  }
}
