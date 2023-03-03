/* Ce service gère les opérations CRUD liées aux utilisateurs dans Firestore.
Il utilise les packages Angular comme HttpClientModule et HttpHeaders.
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
  constructor(private http: HttpClient) {}

  // Enregistre un utilisateur dans Firestore en utilisant une requête HTTP POST
  // Retourne un objet Observable<User | null> qui émettra soit l'objet User enregistré en cas de succès, soit null en cas d'échec.
  save(user: User, jwt: string): Observable<User | null> {
    // URL pour envoyer la requête HTTP POST à Firestore
    const url = `${environment.firebase.firestore.baseURL}/users?key=${environment.firebase.apiKey}&documentId=${user.id}`;

    // Convertit l'objet utilisateur en un objet JSON attendu par Firestore
    const data = this.getDataForFirestore(user);

    // En-tête de la requête HTTP POST
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`, // transmet le JWT reçu au backend.
      }),
    };

    // Envoie la requête HTTP POST à Firestore et retourne un objet Observable<User | null>
    // Transforme les données retournées par Firestore en un objet utilisateur
    return this.http.post(url, data, httpOptions).pipe(
      switchMap((data: any) => {
        return of(this.getUserFromFirestore(data.fields));
      })
    );
  }

  // Récupère un utilisateur à partir de son identifiant en utilisant une requête HTTP POST
  // Retourne un objet Observable<User | null> qui émettra soit l'objet User récupéré en cas de succès, soit null en cas d'échec.
  get(userId: string, jwt: string): Observable<User | null> {
    // URL pour envoyer la requête HTTP POST à Firestore
    const url = `${environment.firebase.firestore.baseURL}:runQuery?key=${environment.firebase.apiKey}`;

    // Convertit l'identifiant de l'utilisateur en un objet JSON attendu par Firestore
    const data = this.getStructuredQuery(userId);

    // En-tête de la requête HTTP POST
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      }),
    };

    // Envoie la requête HTTP POST à Firestore et retourne un objet Observable<User | null>
    // Transforme les données retournées par Firestore en un objet utilisateur
    return this.http.post(url, data, httpOptions).pipe(
      switchMap((data: any) => {
        return of(this.getUserFromFirestore(data[0].document.fields));
      })
    );
  }

  // Convertit l'identifiant de l'utilisateur en un objet JSON attendu par Firestore
  private getStructuredQuery(userId: string): Object {
    return {
      structuredQuery: {
        // Définit la collection Firestore dans laquelle rechercher l'utilisateur
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

        limit: 1, // Limite le nombre de résultats renvoyés à 1
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

  // Mappage d'un objet User en un objet JSON pouvant être stocké dans Firestore
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
