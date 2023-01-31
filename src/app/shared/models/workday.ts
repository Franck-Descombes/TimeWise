import { Task } from './task'; // Lie l’entité workday avec l’entité Task.
  
export class Workday {
 readonly id: string|null; // identifiant de la journée de travail
 dueDate: number; // date à laquelle est prévue la journée de travail
 notes?: string; // facultatif : notes éventuelles prises par l’utilisateur
 tasks: Task[]; // la liste des tâches à faire
 userId: string; // identifiant de l’utilisateur
 
 constructor(options: {
  id?: string,
  dueDate?: number,
  notes?: string,
  tasks?: Task[], // type de la prop tasks : tableau d’instances de Task.
  userId: string  // userId : id du user qui doit réaliser ce workday.
 }){
  this.id = options.id || null;
  this.dueDate = options.dueDate || 0;
  this.notes = options.notes || '';
  this.tasks = options.tasks || [new Task()];
  this.userId = options.userId;
 }
}