import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  // Returns the date passed in parameter in format: 'dd/mm/YYYY'. 
  getDisplayDate(date: Date): string {
    const year: number = date.getFullYear();
    // Récupère le jour/mois de la date passée en paramètre en ajoutant 1. Cela permet d'obtenir le jour/mois correct et le préfixe "0" pour avoir un format "dd"/"mm".
    const month: string = ("0" + (date.getMonth() + 1)).slice(-2);
    const day: string = ("0" + date.getDate()).slice(-2);

    return `${day}/${month}/${year}`;
  }
}