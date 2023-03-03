/* FormGroup permet de regrouper des instances de FormControl, qui représente un champ du formulaire. FormGroup permet donc de déclarer un formulaire réactif.
FormBuilder permet de déclarer des formulaires avec une syntaxe moins verbeuse.
Validators fournit une série de validateurs prédéfinis afin de vérifier les données saisies par l’utilisateur. */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'al-register-form',
  templateUrl: './register-form.component.html',
  styles: [],
})
export class RegisterFormComponent implements OnInit {
  registerForm: FormGroup; // Déclare le formulaire réactif.

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // sur FormBuilder, on appelle la méthode group() qui permet d’instancier un nouveau FormGroup (un form reactif, donc)
    this.registerForm = this.fb.group({
      // Validators.<regle_de_validation> <==> <nom_du_champs>.errors.<regle_de_validation>
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
          Validators.pattern('^[a-zA-Z0-9_-]*$'),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
    });
  }

  // get appartient à TypeScript : permet de définir un getter, donc un accès direct aux champs du formulaire.
  get name() {
    return this.registerForm.get('name');
  } // sans le getter : this.registerForm.get(‘name’).value
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  // La prop value est disponible sur tous les objets FormControl & les instances de FormGroup.
  // Pour accéder à toutes les valeurs du formulaire : this.registerForm.value

  // Call register() avec en param les infos saisies par l’utilisateur dans le formulaire.
  submit(): void {
    this.authService
      .register(this.name?.value, this.email?.value, this.password?.value)
      .subscribe(
        (_) => this.router.navigate(['/app/dashboard']),
        (_) => this.registerForm.reset()
      );
    console.info(this.name?.value);
    console.info(this.email?.value);
    console.info(this.password?.value);
  }
}
