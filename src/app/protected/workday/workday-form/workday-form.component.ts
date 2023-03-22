import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms'; // FormArray permet de regrouper des champs de formulaire sans avoir à déterminer le nombre à l'avance.
import { Validators } from '@angular/forms';
import { WorkdaysService } from 'src/app/core/services/workdays.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/shared/models/user';
import { Workday } from 'src/app/shared/models/workday';


@Component({
  selector: 'al-workday-form',
  templateUrl: './workday-form.component.html',
  styles: []
})
export class WorkdayFormComponent implements OnInit {
  workdayId: string;
  workdayForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private workdaysService: WorkdaysService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.workdayId = '';
      this.workdayForm = this.createWorkdayForm();
      if (params['date']) {
        const date: Date = new Date(+params['date'] * 1000); // x1000 le timestamp reçu pour l'adapter au format des timestamp de JS.
        this.dueDate.setValue(date);
      }
    });
  }

  // Raccourcis pour accéder à des éléments du formulaire
  get dueDate() { return this.workdayForm.get('dueDate') as FormControl; }
  get notes() { return this.workdayForm.get('notes') as FormControl; }
  get tasks() { return this.workdayForm.get('tasks') as FormArray; }

  // Récupère la journée de travail correspondant à une date donnée pour l'utilisateur courant. Le cas échant, remplit le form avec ses valeurs.
  onDateSelected(displayDate: string): void {
    const currentUser: User | null = this.authService.currentUser; // get current user

    if (currentUser && currentUser.id) { // Vérifie si l'utilisateur est authentifié et s'il a un ID
      this.workdaysService.getWorkdayByDate(displayDate, currentUser.id).subscribe(workday => { // Appelle le service WorkdaysService pour récupérer la journée de travail correspondante
        this.resetWorkdayForm(); // Réinitialise le formulaire

        if (!workday) return; // Si pas de journée de travail, on arrête là.

        // Récupère l'id de la journée de travail depuis le Firestore. Tant que celle-ci n’a pas été récupéré, son identifiant vaut toujours null.
        this.workdayId = workday.id as string
        // Remplit les champs du formulaire avec les valeurs de la journée de travail récupérée
        this.notes.setValue(workday.notes); // Remplit le champ notes
        workday.tasks.forEach(task => { // Parcourt la liste des tâches de la journée de travail
          const taskField: FormGroup = this.fb.group({ // Crée un groupe de champs pour une tâche
            title: task.title,
            todo: task.todo,
            done: task.done
          });
          this.tasks.push(taskField); // Ajoute la tâche créée au formulaire
        });
      });
    }
  }

  // Ici, nous devons utiliser while et pour chaque tâche, nous la retirons grâce à la méthode native removeAt() du FormArray.
  resetWorkdayForm() {
    while (this.tasks.length !== 0) {
      this.tasks.removeAt(0);
    }
    this.notes.reset();
  }

  // Créer formulaire avec FormBuilder et Validators
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

  submit(): void { // Détermine si la journée de travail en cours de modification viens du Firestore ou non...
    const user: User | null = this.authService.currentUser;

    if (!(user && user.id)) {
      return;
    }

    // Si oui : Update workday
    if (this.workdayId) {
      const workdayToUpdate: Workday = new Workday({ ...this.workdayForm.value, userId: user.id, id: this.workdayId });

      this.workdaysService.update(workdayToUpdate).subscribe({
        next: () => this.router.navigate(['/app/planning']),
        error: () => this.workdayForm.reset()
      });
      return;
    }

    // Si non : Create workday
    const workdayToCreate = new Workday({ ...this.workdayForm.value, userId: user.id });
    this.workdaysService.save(workdayToCreate).subscribe({
      next: () => this.router.navigate(['/app/planning']),
      error: () => this.workdayForm.reset()
    });
  }
}