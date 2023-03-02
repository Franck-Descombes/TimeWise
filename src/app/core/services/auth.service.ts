// service d’authentification est dédié à la récupération des jetons JWT, et établit si l’utilisateur courant est connecté ou non.
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { switchMap, tap, catchError, finalize } from 'rxjs/operators';
import { UsersService } from './users.service';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Définit un état "user" en utilisant la classe BehaviorSubject de RxJS. Cet état peut être soit un utilisateur connecté (objet de type User), soit null.
  private user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(
    null
  );
  // Le flux user$ est typé en Observable<User|null> pour permettre aux reste de l'app d'observer cet état, authentifié ou non.
  readonly user$: Observable<User | null> = this.user.asObservable();

  constructor(
    private http: HttpClient,
    private usersService: UsersService,
    private errorService: ErrorService,
    private loaderService: LoaderService
  ) {}

  // 1) BUILD URL PATH
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
      tap((user) => this.user.next(user)), // MAJ de l’état du service (après que le user soit inscrit & enregistré dans le Firestore).
      catchError((error) => this.errorService.handleError(error)), // Transmets l’erreur à handleError() du service, elle s’occupera de prévenir les users.
      finalize(() => this.loaderService.setLoading(false)) // Permet de mettre fin à l’affichage du loader, quelque soit l’issue des appels réseaux.
    );
  }

  login(email: string, password: string): Observable<User | null> {
    // 1. A faire : Faire un appel au backend.
    // 2. A faire : Mettre à jour l’état en fonction de la réponse du backend.
    // 3. A faire : Retournez la réponse du backend sous la forme d’un Observable, pour le composant qui déclenche cette action.
    return of(new User()); // Retourne un Observable contenant un utilisateur, grâce à l’opérateur of de RxJS. Simple code pour calmer l'IDE.
  }

  // 'null' lorsque non authentifié.
  logout() {
    return of(null);
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
