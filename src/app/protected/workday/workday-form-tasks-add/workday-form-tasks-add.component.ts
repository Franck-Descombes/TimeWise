import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'al-workday-form-tasks-add',
  templateUrl: './workday-form-tasks-add.component.html',
  styles: [
  ]
})
export class WorkdayFormTasksAddComponent implements OnInit {
  
  @Output() addedTask = new EventEmitter<void>(); // émission d’événement : addedTask

  ngOnInit(): void { }

  addTask() {
    this.addedTask.emit()
  }
}
