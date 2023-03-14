import { Task } from './task'; // crée un 'lien' entre l’entité workday et l’entité Task.

export class Workday {
    readonly id: string | null; // id de la journée de travail.
    dueDate: number; // date à laquelle est prévue la journée de travail.
    displayDate: string; // date d'affichage de la journée de travail 'jj/mm/aaaa'.
    notes?: string; // facultatif : notes éventuelles prises par l’utilisateur.
    tasks: Task[]; // liste des tâches à faire.
    userId: string; // id de l’utilisateur.

    constructor(options: {
        id?: string,
        dueDate?: number,
        displayDate?: string,
        notes?: string,
        tasks?: Task[], // type de la prop tasks : tableau d’instances de Task.
        userId: string  // userId : id du user qui doit réaliser ce workday.
    }) {
        this.id = options.id || null;
        this.dueDate = options.dueDate || 0;
        this.displayDate = options.displayDate || '';
        this.notes = options.notes || '';
        this.tasks = options.tasks || [new Task()];
        this.userId = options.userId;
    }
}