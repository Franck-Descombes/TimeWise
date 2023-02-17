import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'al-workday-form-tasks-add',
  templateUrl: './workday-form-tasks-add.component.html',
  styles: [
  ]
})
export class WorkdayFormTasksAddComponent implements OnInit {

  // émission d’événement : addedTask
  @Output() addedTask = new EventEmitter<void>();

  ngOnInit(): void { }

  addTask() {
    this.addedTask.emit()
  }
}
