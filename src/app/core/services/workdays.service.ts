import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { Task } from 'src/app/shared/models/task';
import { Workday } from 'src/app/shared/models/workday';
import { environment } from 'src/environments/environment';
import { DateService } from './date.service';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';
import { ToastrService } from './toastr.service';

@Injectable({
  providedIn: 'root',
})
export class WorkdaysService {

  constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private errorService: ErrorService,
    private loaderService: LoaderService,
    private dateService: DateService) { }


  // Enregistre une journée de travail dans Firestore.
  save(workday: Workday) {
    const url = `${environment.firebase.firestore.baseURL}/workdays?key=${environment.firebase.apiKey}`;
    const data = this.getWorkdayForFirestore(workday); // Formatte les données de la journée de travail pour Firestore.

    this.loaderService.setLoading(true);

    return this.http.post(url, data, {}).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Votre journée de travail a été enregistrée avec succès.'
      })),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  // Modifier une journée de travail dans le Firestore
  update(workday: Workday) {
    const url = `${environment.firebase.firestore.baseURL}/workdays/${workday.id}?key=${environment.firebase.apiKey}`;
    const data = this.getWorkdayForFirestore(workday);

    this.loaderService.setLoading(true);

    return this.http.patch(url, data, {}).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Votre journée de travail a été sauvegardée avec succès.'
      })),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  remove(workday: Workday) {
    const url = `${environment.firebase.firestore.baseURL}/workdays/${workday.id}?key=${environment.firebase.apiKey}`;

    return this.http.delete(url, {}).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Votre journée de travail a été supprimée avec succès.'
      })),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  // récupére une journée de travail correspondant à une date en particulier. Cette date devient en quelque sorte son identifiant unique.
  getWorkdayByDate(date: string, userId: string): Observable<Workday | null> {
    const url = `${environment.firebase.firestore.baseURL}:runQuery?key=${environment.firebase.apiKey}`;
    const data = this.getSructuredQuery(date, userId);

    return this.http.post(url, data, {}).pipe(
      switchMap((data: any) => {
        const document = data[0].document;
        if (!document) {
          return of(null);
        }
        return of(this.getWorkdayFromFirestore(document.name, document.fields));
      })
    );
  }

  /* Récupère toutes les journées de travail d'un utilisateur donné à partir de Firestore.
   * @param userId L'identifiant de l'utilisateur pour lequel récupérer les journées de travail.
   * @returns Un Observable émettant un tableau de toutes les journées de travail de l'utilisateur.
   * @throws Une erreur si la requête échoue ou si les données reçues de Firestore ne sont pas valides.
   */
  getWorkdayByUser(userId: string): Observable<Workday[]> {
    // Définit l'URL et les données pour la requête Firestore.
    const url = `${environment.firebase.firestore.baseURL}:runQuery?key=${environment.firebase.apiKey}`;
    const data = this.getWorkdaysByUserQuery(userId);

    // Effectue la requête Firestore et transforme les données reçues en un tableau de journées de travail.
    return this.http.post(url, data, {}).pipe(
      switchMap((workdaysData: any) => {
        const workdays: Workday[] = [];
        workdaysData.forEach((data: any) => {
          if (data && data.document) {
            const workday: Workday = this.getWorkdayFromFirestore(data.document.name, data.document.fields);
            workdays.push(workday);
          }
        });
        return of(workdays);
      }),
      catchError(error => this.errorService.handleError(error))
    );
  }

  // retourne une requête structurée pour récupérer tous les jours de travail d'un utilisateur donné
  getWorkdaysByUserQuery(userId: string) {
    return {
      'structuredQuery': {
        // Définit la collection à partir de laquelle récupérer les jours de travail
        'from': [{
          'collectionId': 'workdays'
        }],
        // Définit le filtre pour récupérer seulement les jours de travail de l'utilisateur spécifié
        'where': {
          'fieldFilter': {
            'field': { 'fieldPath': 'userId' },
            'op': 'EQUAL',
            'value': { 'stringValue': userId }
          }
        },
        // Définit l'ordre de tri pour les jours de travail récupérés
        "orderBy": [{
          "field": {
            "fieldPath": "dueDate"
          },
          "direction": "DESCENDING"
        }]
      }
    };
  }


  // récupére les données brutes stockées dans le Firestore pour en faire un modèle métier.
  private getWorkdayFromFirestore(name: string, fields: any): Workday {
    const tasks: Task[] = [];
    const workdayId: string = name.split('/')[6];

    fields.tasks.arrayValue.values.forEach((data: any) => {
      const task: Task = new Task({
        completed: data.mapValue.fields.completed.booleanValue,
        done: data.mapValue.fields.done.integerValue,
        title: data.mapValue.fields.title.stringValue,
        todo: data.mapValue.fields.todo.integerValue
      });
      tasks.push(task);
    });

    return new Workday({
      id: workdayId,
      userId: fields.userId.stringValue,
      notes: fields.notes.stringValue,
      displayDate: fields.displayDate.stringValue,
      dueDate: fields.dueDate.integerValue,
      tasks: tasks
    });
  }

  // Fournit les informations nécessaires à notre requête pour le Firestore
  private getSructuredQuery(date: string, userId: string): any {
    return {
      'structuredQuery': {
        'from': [{
          'collectionId': 'workdays'
        }],
        'where': {
          'compositeFilter': {
            'op': 'AND',
            'filters': [
              {
                'fieldFilter': {
                  'field': { 'fieldPath': 'displayDate' }, // displayDate : champ sur lequel on construit notre requête.
                  'op': 'EQUAL',
                  'value': { 'stringValue': date } // vérifie si la date d’affichage correspond à la date passée en paramètre.
                  // ainsi, getWorkdayByDate() renverra la journée de travail correspondant à cette date (ou null si aucune n'est trouvée).
                }
              },
              {
                'fieldFilter': {
                  'field': { 'fieldPath': 'userId' },
                  'op': 'EQUAL',
                  'value': { 'stringValue': userId }
                }
              }
            ]
          }
        },
        'limit': 1
      }
    };
  }

  // Retourne le corps de la requête globale à envoyé a API Rest de Firestore :
  private getWorkdayForFirestore(workday: Workday): any {
    let dueDate: number; // Timestamp traditionnelle en secondes.
    let dueDateMs: number; // Timestamp JavaScript en millisecondes.

    // gestion du cas où une date serait une date JavaScript provenant du formulaire des Workdays, ou un timestamp provenant du Firestore.
    if (typeof workday.dueDate == 'string') {
      dueDate = +workday.dueDate;
      dueDateMs = dueDate * 1000;
    } else {
      dueDate = new Date(workday.dueDate).getTime() / 1000;
      dueDateMs = dueDate * 1000;
    }

    // calcul de la date d’affichage grâce à getDisplayDate() et au timestamp de JavaScript.
    const displayDate: string = this.dateService.getDisplayDate(new Date(dueDateMs)); // La nouvelle propriété displayDate est prise en compte.
    const tasks: Object = this.getTaskListForFirestore(workday.tasks);

    return {
      fields: {
        dueDate: { integerValue: dueDate }, // pousse le timestamp « normal » de la journée de travail vers le Firestore.
        displayDate: { stringValue: displayDate },
        tasks: tasks,
        notes: { stringValue: workday.notes },
        userId: { stringValue: workday.userId }
      }
    };
  }

  // Construit la partie du corps de la requête qui correspond à la liste des tâches.
  private getTaskListForFirestore(tasks: Task[]): any {
    const taskList: any = {
      arrayValue: {
        values: []
      }
    };
    // Construit la partie du corps de la requête qui correspond à une seule tâche.
    tasks.forEach(task => taskList.arrayValue.values.push(this.getTaskForFirestore(task)));

    return taskList;
  }

  // Formatte une tâche individuelle pour Firestore.
  private getTaskForFirestore(task: Task): any {
    return {
      mapValue: {
        fields: {
          title: { stringValue: task.title },
          todo: { integerValue: task.todo },
          done: { integerValue: task.done },
          completed: { booleanValue: false }
        }
      }
    }
  }
}
