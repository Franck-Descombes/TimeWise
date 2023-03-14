import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'al-workday-form-tasks-item',
  templateUrl: './workday-form-tasks-item.component.html',
  styleUrls: ['./workday-form-tasks-item.component.scss']
})
export class WorkdayFormTasksItemComponent implements OnInit {
  // Input properties: used to pass data from the parent component to this component.
  @Input() task: FormGroup;
  @Input() index: number;
  @Input() isFirst: boolean;
  @Input() isLast: boolean;

  // Output property: emit an event when user clicks on the cross icon.
  @Output() removedTask = new EventEmitter<number>();

  ngOnInit(): void { }

  // L’événement émis contiendra l’index de la tâche à supprimer.
  removeTask(index: number) {
    this.removedTask.emit(index);
  }

  // Prend un nombre de pomodoros en paramètre et MAJ cette info dans la propriété todo de la tâche correspondante.
  selectTodo(todo: number) {
    // PatchValue -fournie par Angular- permet de mettre à jour seulement certaines propriétés d’un objet.
    // Contrairement à setValue, qui remplace complètement la valeur du champ FormControl concerné !)
    this.task.patchValue({todo: todo});
   }

}
