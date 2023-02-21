import { Component, Input } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms'; // le FormBuilder simplifie l’ajout d’une tâche.

@Component({
  selector: 'al-workday-form-tasks',
  templateUrl: './workday-form-tasks.component.html',
  styles: [
  ]
})
export class WorkdayFormTasksComponent {
  // Accéde à la liste des champs à l’intérieur de l'entrée 'tasks' de type FormArray.
  @Input() tasks: FormArray;
  @Input() workdayForm: FormGroup;

  taskControlList: FormGroup[]; // prop. 'intermédiaire' qui est un [] d’instance de FormGroup qui est légèremment différent de l’objet FormArray en tant que tel.

  constructor(private fb: FormBuilder) { } // injection du FormBuilder.

  ngOnInit(): void {
    this.taskControlList = this.tasks.controls as FormGroup[];
  }

  // externalisation de la création d’un nouveau champ pour une tâche.
  createTaskForm(): FormGroup {
    const taskForm: FormGroup = this.fb.group({
      // min & max permettent de valider des nombres ; minLength & maxLength pour les strings. 
      'title': ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(150)
      ]],
      'todo': [1, [
        Validators.required,
        Validators.min(1),
        Validators.max(5)
      ]],
      'done': 0 // champ non visible & non éditable. initialisé 0 car l’utilisateur n’a pas commencé à travailler sur une tâche fraîchement créée.
    });

    return taskForm;
  }

  // Créer un nouveau champ pour une tâche.
  onAddedTask() {
    const task: FormGroup = this.createTaskForm();
    this.tasks.push(task);
  }
  // Prend en param un index et retire le champ présent à cet index dans le tableau des tâches (spécifique au FormArray).
  onRemovedTask(index: number) {
    this.tasks.removeAt(index);
  }
}
