import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms'; // FormArray permet de regrouper des champs de formulaire sans avoir à déterminer le nombre à l'avance.
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { WorkdaysService } from 'src/app/core/services/workdays.service';
import { User } from 'src/app/shared/models/user';
import { Workday } from 'src/app/shared/models/workday';

@Component({
  selector: 'al-workday-form',
  templateUrl: './workday-form.component.html',
  styles: []
})
export class WorkdayFormComponent implements OnInit {

  workdayForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private workdaysService: WorkdaysService) { }

  ngOnInit() {
    // Crée le formulaire à l'initialisation du composant
    this.workdayForm = this.createWorkdayForm();
  }

  // Raccourcis pour accéder à des éléments du formulaire
  get dueDate() { return this.workdayForm.get('dueDate') as FormControl; }
  get notes() { return this.workdayForm.get('notes') as FormControl; }
  get tasks() { return this.workdayForm.get('tasks') as FormArray; }

  // Crée le formulaire en utilisant FormBuilder et Validators
  createWorkdayForm(): FormGroup {
    const workdayForm: FormGroup = this.fb.group({
      'dueDate': ['', [
        Validators.required
      ]],
      'tasks': this.fb.array([], [
        Validators.required,
        Validators.maxLength(6)
      ]),
      'notes': ['', [
        Validators.maxLength(1000)
      ]]
    });
    return workdayForm;
  }

  // Soumet le formulaire
  // utilisateur courant indeterminé = impossibilité de pousser le workday dans Firestore, car nous ignorons à quel utilisateur est associé à la journée de travail en cours.
  submit(): void {
    // Récupère l'utilisateur courant
    const user = this.authService.currentUser;

    if (user) {
      // Crée un objet Workday à partir des données du formulaire et de l'ID du current user
      const workday: Workday = new Workday({ ...this.workdayForm.value, userId: user.id });
      // Enregistre le Workday et redirige vers la page de planification si réussi, sinon réinitialise le formulaire
      this.workdaysService.save(workday).subscribe({
        next: () => this.router.navigate(['/app/planning']),
        error: () => this.workdayForm.reset()
      });
    }
  }
}