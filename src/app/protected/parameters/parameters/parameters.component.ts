import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'al-parameters',
  templateUrl: './parameters.component.html',
  styles: [],
})
export class ParametersComponent implements OnInit {
  parametersForm: FormGroup;
  pomodoros: number[] = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

  constructor(public fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.parametersForm = this.fb.group({
      pomodoro: ['', [Validators.required]],
    });
  }

  // récupère la dernière valeur de l’utilisateur courant, grâce à la méthode currentUser()
  onSubmit() {
    const user: User | null = this.authService.currentUser;
    if (user) {
      // puis défini une new value (celle que l’utilisateur a sélectionné depuis le formulaire des paramètres).
      user.pomodoroDuration = this.parametersForm.get('pomodoro')?.value * 60;
      this.authService.updateUserState(user).subscribe();
    }
  }
}
