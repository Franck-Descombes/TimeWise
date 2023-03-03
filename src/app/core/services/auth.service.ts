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

  // Cette méthode sert à enregistrer un nouvel utilisateur dans l'application en utilisant les informations fournies.
  // Elle envoie une requête HTTP POST au backend pour créer un nouvel utilisateur avec l'API Firebase, puis stocke les informations de l'utilisateur créé dans la base de données Firestore.
  // Si l'enregistrement est réussi, elle met à jour l'état de l'utilisateur authentifié et retourne un Observable qui émet l'utilisateur créé.
  // Si une erreur survient, elle renvoie un Observable qui émet l'erreur et la transmet à la méthode handleError() du service d'erreur.
  public register(
    name: string,
    email: string,
    password: string
  ): Observable<User | null> {
    // URL de l'API Firebase pour l'enregistrement d'un nouvel utilisateur
    const url = `${environment.firebase.auth.baseURL}/signupNewUser?key=${environment.firebase.apiKey}`;

    // Les informations de l'utilisateur à enregistrer dans le backend
    const data = { email: email, password: password, returnSecureToken: true };

    // Options HTTP pour l'en-tête de la requête
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    // Affiche le loader pendant l'envoi de la requête HTTP
    this.loaderService.setLoading(true);

    // Envoie la requête HTTP POST au backend pour créer un nouvel utilisateur avec l'API Firebase
    return this.http.post(url, data, httpOptions).pipe(
      // Si la requête est réussie, enregistre l'utilisateur dans la base de données Firestore et renvoie un Observable qui émet l'utilisateur créé
      switchMap((data: any) => {
        // Extrait le jeton JWT de la réponse HTTP
        const jwt: string = data.idToken;

        // Crée un objet User à partir des informations de l'utilisateur nouvellement créé
        const user = new User({
          email: data.email,
          id: data.localId,
          name: name,
        });

        // Enregistre l'utilisateur créé dans la base de données Firestore
        return this.usersService.save(user, jwt);
      }),
      // Si l'enregistrement est réussi, met à jour l'état de l'utilisateur authentifié
      tap((user) => this.user.next(user)),
      // Si une erreur survient, transmet l'erreur à la méthode handleError() du service d'erreur
      catchError((error) => this.errorService.handleError(error)),
      // Arrête l'affichage du loader, que la requête soit réussie ou non
      finalize(() => this.loaderService.setLoading(false))
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
