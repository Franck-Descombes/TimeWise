// Composant dédié à la gestion des notes.
import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'al-workday-form-notes',
  templateUrl: './workday-form-notes.component.html',
  styles: [
  ]
})
export class WorkdayFormNotesComponent {
  @Input() notes: FormControl; // réception du champ des notes

  constructor() { }

  ngOnInit() { }

}
