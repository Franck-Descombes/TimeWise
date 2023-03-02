// user.service.ts est chargé des opérations concernant les utilisateurs dans le Firestore (CRUD).
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

  // Prend en param une instance de User et sauvegarde cet utilisateur dans le Firestore.
  // Elle retourne un objet Observable<User | null> qui émettra soit l'objet User enregistré en cas de succès, soit null en cas d'échec.
  save(user: User, jwt: string): Observable<User | null> {
    const url =
   `${environment.firebase.firestore.baseURL}/users?key=
    ${environment.firebase.apiKey}&documentId=${user.id}`;

    // mapping entre l'objet métier User & les données attendues par le Firestore.
    const data = this.getDataForFirestore(user);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`, // transmet le JWT reçu au backend.
      }),
    };

    // récupére puis transforme les données issues de la requête Firestore en un objet métier User, grâce à getUserFromFirestore().
    // Puis réémet les informations de l’utilisateur dans un Observable, grâce à l’opérateur of().
    return this.http.post(url, data, httpOptions).pipe(
      switchMap((data: any) => {
        return of(this.getUserFromFirestore(data.fields));
      })
    );
  }

  // méthodes de mappings entre le format des réponses du Firestore et l'objet métier User.
  private getUserFromFirestore(fields: any): User {
    return new User({
      id: fields.id.stringValue,
      email: fields.email.stringValue,
      pomodoroDuration: fields.pomodoroDuration.integerValue,
      name: fields.name.stringValue,
      avatar: fields.avatar.stringValue,
    });
  }

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
