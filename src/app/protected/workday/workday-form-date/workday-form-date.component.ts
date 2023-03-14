// composant dédié à l’affichage et la gestion de la date de notre journée de travail, synchronisé avec le composant du formulaire principal.
// composant de gestion du champ date qui intercepte les dates sélectionnées par l’utilisateur, et les remontent au composant parent dans un format pertinent. 
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Form } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker'; // service de langue
import { DateService } from 'src/app/core/services/date.service';

@Component({
  selector: 'al-workday-form-date',
  templateUrl: './workday-form-date.component.html',
  styles: [
  ]
})
export class WorkdayFormDateComponent implements OnInit {

  @Input() dueDate: FormControl;
  @Output() dateSelected = new EventEmitter<string>();

  constructor(
    private localeService: BsLocaleService,
    private dateService: DateService) { }

  ngOnInit() {
    this.localeService.use('fr'); // param de langue qui est chargé au niveau du workday.module.ts
  }

  // intercèpte les dates via bsValueChange.
  //Pour chaque date interceptée, on la transforme en sa date d’affichage grâce à la méthode getDisplayDate du service DateService.
  selectDate(date: Date): void {
    if (date) {
      const displayDate: string = this.dateService.getDisplayDate(date);
      this.dateSelected.emit(displayDate);
    }
  }
}
