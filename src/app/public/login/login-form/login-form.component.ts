import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'al-login-form',
  templateUrl: './login-form.component.html',
  styles: [
  ]
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    // sur FormBuilder, on appelle la méthode group() qui permet d’instancier un nouveau FormGroup.
    this.loginForm = this.fb.group({
      // Validators.<regle_de_validation> <==> <nom_du_champs>.errors.<regle_de_validation>
      'email': ['', [
        Validators.required,
        Validators.email
      ]],
      'password': ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        // Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{6,}$')
      ]]
    });
  }

  // Déclaration des getters, qui facilitera l’accès aux champs du formulaire.
  get email() { return this.loginForm.get('email') }
  get password() { return this.loginForm.get('password') }

  submit(): void {
    // Safe Navigation Operator ('?'de TypeScript) => permet de ne pas lever d’erreur au cas où le champ est null; évite les erreurs du type « Can not call <nom de la propriété ou méthide> on undefined or null ».
    console.info(this.email?.value);
    console.info(this.password?.value);
    this.router.navigate(['/app/dashboard']);
  }
}
