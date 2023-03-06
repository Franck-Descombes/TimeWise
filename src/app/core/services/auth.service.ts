// Ce service d'authentification est responsable de la récupération des jetons JWT et de la vérification de la connexion de l'utilisateur courant.
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { switchMap, tap, catchError, finalize, delay } from 'rxjs/operators';
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
        this.saveAuthData(data.localId, jwt); // Lorsque l’utilisateur s’inscrit, on sauvegarde ces informations de connexion.
        return this.usersService.save(user, jwt); // Enregistre l'utilisateur créé dans la base de données Firestore
      }),
      tap((user) => this.user.next(user)), // Si l'enregistrement est réussi, met à jour l'état de l'utilisateur authentifié
      tap((_) => this.logoutTimer(3600)), // déclenche la minuterie.
      catchError((error) => this.errorService.handleError(error)), // Si une erreur survient, transmet l'erreur à la méthode handleError() du service d'erreur
      finalize(() => this.loaderService.setLoading(false)) // Arrête l'affichage du loader, que la requête soit réussie ou non
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
        this.saveAuthData(data.localId, jwt); // sauvegarde des informations de connexion de l'utilisateur.
        return this.usersService.get(userId, jwt);
      }),
      tap((user) => this.user.next(user)), // Update service status.
      tap((_) => this.logoutTimer(3600)), // déclenche la minuterie.
      catchError((error) => this.errorService.handleError(error)), // Intercept potential errors.
      finalize(() => this.loaderService.setLoading(false)) // Stop loading (if it's set to true).
    );
  }

  autoLogin(user: User) {
    this.user.next(user);
    this.router.navigate(['app/dashboard']);
  }

  private saveAuthData(userId: string, token: string) {
    const now = new Date();
    const expirationDate = (now.getTime() + 3600 * 1000).toString();
    localStorage.setItem('expirationDate', expirationDate);
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
  }

  // déclenche la minuterie (inscription & connexion du user)
  private logoutTimer(expirationTime: number): void {
    of(true)
      .pipe(delay(expirationTime * 1000))
      .subscribe((_) => this.logout());
  }

  // 'null' lorsque non authentifié.
  logout(): void {
    // 3 ci-dessous: nécessaires pour vider le localStorage quand user déconnecté. 
    localStorage.removeItem('expirationDate'); 
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); 
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
