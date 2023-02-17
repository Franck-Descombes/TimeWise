import { Component, Input } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms'; // le FormBuilder simplifie l’ajout d’une tâche.

@Component({
  selector: 'al-workday-form-tasks',
  templateUrl: './workday-form-tasks.component.html',
  styles: [
  ]
})
export class WorkdayFormTasksComponent {
  // Pour accéder à la liste des champs à l’intérieur de l'entrée 'tasks' de type FormArray
  @Input() tasks: FormArray;
  @Input() workdayForm: FormGroup;

  taskControlList: FormGroup[]; // prop. 'intermédiaire' => tableau d’instance de FormGroup qui est légèremment différent de l’objet FormArray en tant que tel.

  constructor(private fb: FormBuilder) { } // injection du FormBuilder

  ngOnInit(): void {
    this.taskControlList = this.tasks.controls as FormGroup[];
  }

  // Instancie un nouveau FormGroup contenant un titre de tâche vide.
  onAddedTask() {
    const taskGroup: FormGroup = this.fb.group({
      'title': ''
    });
    // Pousse cette tâche vierge dans la liste des tâches du formulaire.
    this.tasks.push(taskGroup)
  }
  // (spécifique au FormArray) Prend en param un index et retire le champ présent à cet index dans le tableau des tâches. 
  onRemovedTask(index: number) {
    this.tasks.removeAt(index);
  }
}
