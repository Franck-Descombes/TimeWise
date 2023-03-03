// Ce service d'authentification est responsable de la récupération des jetons JWT et de la vérification de la connexion de l'utilisateur courant.
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { switchMap, tap, catchError, finalize } from 'rxjs/operators';
import { UsersService } from './users.service';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Définit un état "user" en utilisant la classe BehaviorSubject de RxJS. Cet état peut être soit un utilisateur connecté (objet de type User), soit null.
  private user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(
    null
  );
  // Le flux $user est un Observable qui émet un nouvel utilisateur authentifié.
  readonly user$: Observable<User | null> = this.user.asObservable();

  constructor(
    private http: HttpClient,
    private usersService: UsersService,
    private errorService: ErrorService,
    private loaderService: LoaderService,
    private router: Router
  ) {}

  /* REGISTER ET LOGER UN USER :
     1. A faire : Faire un appel au backend.
     2. A faire : Mettre à jour l’état en fonction de la réponse du backend.
     3. A faire : Retournez la réponse du backend sous la forme d’un Observable, pour le composant qui déclenche cette action.*/

  // 1) URL PATH FOR FIREBASE REGISTRATION
  public register(
    name: string,
    email: string,
    password: string
  ): Observable<User | null> {
    const url = `${environment.firebase.auth.baseURL}/signupNewUser?key=${environment.firebase.apiKey}`;
    /* OLD WAY TO DECLARE & CONCATENATE VARIABLES WITHOUT USING environment.ts:
                    const API_KEY: string = 'AIzaSyC1bnYLISWi1Pk10uM43YkCs59Evx8X0Hk'; // firebase unique ID
                    const API_AUTH_BASEURL: string = `https://www.googleapis.com/identitytoolkit/v3/relyingparty`; // common path to all firebase endpoints
                    const url: string = `${API_AUTH_BASEURL}/signupNewUser?key=${API_KEY}`; // URL built */

    // 2) SEND PAYLOAD TO THE REST API.
    const data = { email: email, password: password, returnSecureToken: true };

    // 3) ADD HEADER USING HTTPHEADERS CLASS
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    this.loaderService.setLoading(true);

    // 4) EXECUTE AUTH REQUEST USING HTTPCLIENT CLASS
    return this.http.post(url, data, httpOptions).pipe(
      switchMap((data: any) => {
        const jwt: string = data.idToken;
        const user = new User({
          email: data.email,
          id: data.localId,
          name: name,
        });

        return this.usersService.save(user, jwt);
      }),
      // 'tap' est un petit utilitaire permettant d’effectuer une action avec les données qui transitent dans un flux, sans pour autant le modifier.
      tap((user) => this.user.next(user)), // update service status.
      catchError((error) => this.errorService.handleError(error)), // Transmets l’erreur à handleError() du service, elle s’occupera de prévenir les users.
      finalize(() => this.loaderService.setLoading(false)) // Permet de mettre fin à l’affichage du loader, quelque soit l’issue des appels réseaux.
    );
  }

  public login(email: string, password: string): Observable<User | null> {
    const url = `${environment.firebase.auth.baseURL}/verifyPassword?key=${environment.firebase.apiKey}`;
    const data = { email: email, password: password, returnSecureToken: true };
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    this.loaderService.setLoading(true); // set loader to true.

    return this.http.post<User>(url, data, httpOptions).pipe(
      switchMap((data: any) => {
        const userId: string = data.localId;
        const jwt: string = data.idToken;
        return this.usersService.get(userId, jwt);
      }),
      tap((user) => this.user.next(user)), // Update service status.
      catchError((error) => this.errorService.handleError(error)), // Intercept potential errors.
      finalize(() => this.loaderService.setLoading(false)) // Stop loading (which has been set to true).
    );
  }

  // 'null' lorsque non authentifié.
  logout(): void {
    this.user.next(null);
    this.router.navigate(['/login']);
  }
}

// _______________________________________________________________________________________________________________________________________________
/* PS. Si le composant est abonné à un état, l’action doit simplement mettre à jour cet état. Pourquoi ya t’il besoin d’une valeur de retour ?
    ==> Exact mais dans le composant qui appelle l’action login du service de données, nous voulons obtenir en retour l’utilisateur venant de s’inscrire.    
    ==> Pour cela, il faut que la méthode login retourne un Observable contenant le nouvel utilisateur, en plus de modifier l’état au niveau du service. 

 submit() {
   this.authService.login('John', 'Doe').subscribe(user => {
      this.user = user;
      // Effectuer une autre action, avec l’utilisateur venant de s’inscrire.
    });
  } */
