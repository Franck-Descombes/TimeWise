import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

// Le service d’authentification s’occupe de garantir la validité des informations de l’utilisateur courant. Il gère cet état global dans l’application, et « c’est tout ».
// Le service des utilisateurs s’occupe d’effectuer les requêtes au Firestore afin que les données affichées dans l'application Angular et les données sauvegardées dans le Firestore soient identiques.
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'al-profil',
  templateUrl: './profil.component.html',
  styles: [],
})
export class ProfilComponent implements OnInit {
  // Création de la variable du formulaire et de l'utilisateur connecté
  profilForm: FormGroup;
  user: User | null;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    // Récupération de l'utilisateur actuellement connecté
    this.user = this.authService.currentUser;

    // Création du formulaire avec les champs nécessaires et les validateurs. Les valeurs actuelles de l'utilisateur connecté sont également affectées aux champs du formulaire.
    this.profilForm = this.fb.group({
      name: [
        this.user?.name, // Valeur initiale du champ de nom
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
          Validators.pattern('^[a-zA-Z0-9_-]*$'),
        ],
      ],
      avatar: [
        this.user?.avatar, // Valeur initiale du champ d'avatar
        [Validators.pattern('https?://.+')],
      ],
    });
  }

  // getter : méthodes d'accesseur pour obtenir les champs du formulaire. Ils sont utilisés pour obtenir la valeur des champs dans la méthode submit.
  get name() {
    return this.profilForm.get('name') as FormControl;
  }
  get avatar() {
    return this.profilForm.get('avatar') as FormControl;
  }

  // Fonction de soumission du formulaire
  submit(): void {
    if (this.user) {
      // Si l'utilisateur actuel existe
      // Récupération des valeurs des champs de formulaire et affectation à l'utilisateur actuel
      this.user.name = this.profilForm.get('name')?.value;
      this.user.avatar = this.profilForm.get('avatar')?.value;

      // Appel de la méthode de MAJ de l'état de l'utilisateur du service AuthService
      this.authService.updateUserState(this.user).subscribe(); // subscribe est appelée pour que la MAJ se fasse de manière asynchrone.
    }
  }
}
