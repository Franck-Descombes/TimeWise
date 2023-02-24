import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from 'src/app/shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Définit un état nommé "user" en utilisant la classe BehaviorSubject de RxJS. Cet état peut être soit un utilisateur connecté (un objet de type User), soit null si aucun utilisateur n'est connecté.
  private user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  // Le flux "user$" est typé en Observable<User|null> pour permettre aux autres parties de l'application d'observer cet état, authentifié ou non.
  readonly user$: Observable<User | null> = this.user.asObservable();

  constructor() { }

  login(email: string, password: string): Observable<User | null> {
    // 1. A faire : Faire un appel au backend.
    // 2. A faire : Mettre à jour l’état en fonction de la réponse du backend.
    // 3. A faire : Retournez la réponse du backend sous la forme d’un Observable, pour le composant qui déclenche cette action.

    return of(new User());
    // Retourne un Observable contenant un utilisateur, grâce à l’opérateur of de RxJS. Simple code pour calmer l'IDE.
  }

  register(name: string, email: string, password: string): Observable<User | null> {
    return of(new User());
  }

  // 'null' lorsque non authentifié.
  logout() {
    return of(null);
  }
}

/* PS. Si le composant est abonné à un état, l’action doit simplement mettre à jour cet état. Pourquoi ya t’il besoin d’une valeur de retour ?
    ==> Exact mais dans le composant qui appelle l’action login du service de données, nous voulons obtenir en retour l’utilisateur venant de s’inscrire.    
    ==> Pour cela, il faut bien que la méthode login retourne un Observable contenant le nouvel utilisateur, en plus de modifier l’état au niveau du service. 

 submit() {
   this.authService.login('John', 'Doe').subscribe(user => {
      this.user = user;
      // Effectuer une autre action, avec l’utilisateur venant de s’inscrire.
    });
  }
*/


