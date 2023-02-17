// composant dédié à l’affichage et la gestion de la date de notre journée de travail, synchronisé avec le composant du formulaire principal.
import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker'; // service de langue

@Component({
  selector: 'al-workday-form-date',
  templateUrl: './workday-form-date.component.html',
  styles: [
  ]
})
export class WorkdayFormDateComponent implements OnInit {

  @Input() dueDate: FormControl; // déclare une propriété d’entrée. 

  constructor(private localeService: BsLocaleService) { } // injection du service

  ngOnInit() {
    this.localeService.use('fr'); // prend en paramètre une langue, qui doit préalablement avoir été chargé au niveau du module (ici, worday.module.ts)
  }

}
