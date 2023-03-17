/* Ce service gère les opérations CRUD liées aux utilisateurs dans Firestore. Il utilise les packages Angular comme HttpClientModule et HttpHeaders.
Il définit également une classe UsersService en tant que fournisseur de services pour les autres composants Angular.*/
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/shared/models/user';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) { }

  // Enregistre un objet utilisateur dans Firestore et renvoie un objet Observable<User | null>.
  // Cet Observable émet soit l'objet User enregistré en cas de succès, soit null en cas d'échec.
  save(user: User, jwt: string): Observable<User | null> {
    const url = `${environment.firebase.firestore.baseURL}/users?key=${environment.firebase.apiKey}&documentId=${user.id}`;

    // Mapping entre l'objet User et les données requises par Firestore.
    const data = this.getDataForFirestore(user);
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${jwt}` // Envoie le JWT reçu au backend.
      }),
    };

    // Récupère les données retournées par la requête Firestore et les transforme en un objet User.
    return this.http.post(url, data, httpOptions).pipe(
      switchMap((data: any) => {
        return of(this.getUserFromFirestore(data.fields));
      })
    );
  }

  // Récupère un objet utilisateur à partir de son ID, en utilisant Firestore et renvoie un objet Observable<User | null>.
  get(userId: string, jwt: string): Observable<User | null> {
    const url = `${environment.firebase.firestore.baseURL}:runQuery?key=${environment.firebase.apiKey}`;
    const data = this.getStructuredQuery(userId); // Crée un objet structuré pour la requête Firestore (convertit l'id du user en un objet JSON).
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${jwt}`,
      }),
    };

    // Récupère les données retournées par la requête Firestore et les transforme en un objet User.
    return this.http.post(url, data, httpOptions).pipe(
      switchMap((data: any) => {
        return of(this.getUserFromFirestore(data[0].document.fields));
      })
    );
  }

  // MAJ les informations d'un objet utilisateur dans Firestore et renvoie un objet Observable<User | null>.
  // Cette méthode fait la requête au backend Firestore. Elle est appelée par la méthode updateUserState() du service AuthService.
  update(user: User): Observable<User | null> {
    const url = `${environment.firebase.firestore.baseURL}/users/${user.id}?key=${environment.firebase.apiKey}&currentDocument.exists=true`;
    const data = this.getDataForFirestore(user); // Body request
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`, // get JWT from localstorage.
      }),
    };

    return this.http.patch(url, data, httpOptions).pipe(
      switchMap((data: any) => {
        return of(this.getUserFromFirestore(data.fields));
      })
    );
  }

  // Convertit l'identifiant de l'utilisateur en un objet JSON pour Firestore
  private getStructuredQuery(userId: string): Object {
    return {
      structuredQuery: {
        // Spécifie la collection Firestore dans laquelle effectuer la recherche
        from: [{ collectionId: 'users' }],

        // Définit les critères de recherche pour l'utilisateur
        where: {
          fieldFilter: {
            // Champ "id" de la collection Firestore
            field: { fieldPath: 'id' },
            // Recherche l'utilisateur dont l'ID correspond à l'ID fourni
            op: 'EQUAL',
            value: { stringValue: userId },
          },
        },

        // Limite le nombre de résultats renvoyés à 1
        limit: 1,
      },
    };
  }

  // Mappage des résultats Firestore en un objet User
  private getUserFromFirestore(fields: any): User {
    return new User({
      id: fields.id.stringValue,
      email: fields.email.stringValue,
      pomodoroDuration: fields.pomodoroDuration.integerValue,
      name: fields.name.stringValue,
      avatar: fields.avatar.stringValue,
    });
  }

  // Convertit un objet User en un objet JSON pouvant être stocké dans Firestore
  private getDataForFirestore(user: User): Object {
    return {
      fields: {
        id: { stringValue: user.id },
        email: { stringValue: user.email },
        name: { stringValue: user.name },
        avatar: { stringValue: user.avatar },
        pomodoroDuration: { integerValue: user.pomodoroDuration },
      },
    };
  }
}
