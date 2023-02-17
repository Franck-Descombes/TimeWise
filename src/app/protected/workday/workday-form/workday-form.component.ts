import { Component, OnInit } from '@angular/core';
// FormArray permet de regrouper des champs de formulaire sans avoir à déterminer le nombre à l'avance.

import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'al-workday-form',
  templateUrl: './workday-form.component.html',
  styles: [
  ]
})
export class WorkdayFormComponent implements OnInit {

  workdayForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.workdayForm = this.createWorkdayForm();
  }

  get dueDate() { return this.workdayForm.get('dueDate') as FormControl; }
  get notes() { return this.workdayForm.get('notes') as FormControl; }
  get tasks() { return this.workdayForm.get('tasks') as FormArray; }

  // un FormArray agrège les valeurs et l’état de validité des champs qui le composent.
  createWorkdayForm(): FormGroup {
    const workdayForm: FormGroup = this.fb.group({
      'dueDate': '',
      'tasks': this.fb.array([]),
      'notes': '',
    });
    return workdayForm;
  }

  submit(): void {
    console.info(this.workdayForm.value);
  }
}
