import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'al-workday-form-tasks-item',
  templateUrl: './workday-form-tasks-item.component.html',
  styleUrls: ['./workday-form-tasks-item.component.scss']
})
export class WorkdayFormTasksItemComponent implements OnInit {
  // retrieve all properties of entries 
  @Input() task: FormGroup;
  @Input() index: number;
  @Input() isFirst: boolean;
  @Input() isLast: boolean;

  // event emitted when user clicks on the cross
  @Output() removedTask = new EventEmitter<number>();

  ngOnInit(): void { }

  // L’événement émis contiendra l’index de la tâche à supprimer.
  removeTask(index: number) {
    this.removedTask.emit(index);
  }
}
