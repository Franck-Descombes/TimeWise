/* Quelques points à noter :
Importations : Le composant importe les éléments nécessaires à partir des modules @angular/core et @angular/forms.
    Il importe également deux services personnalisés AuthService et User, qui sont probablement définis ailleurs dans l'application.
Déclarations de variables : Le composant contient deux variables : profilForm et user. profilForm est une instance de la classe FormGroup qui est utilisée pour créer un formulaire.
    user est une instance de la classe User ou null qui stocke les informations sur l'utilisateur actuellement connecté.
Méthode ngOnInit : La méthode ngOnInit est appelée une fois que le composant est initialisé. Elle assigne la valeur actuelle de l'utilisateur connecté à la variable user.
    Ensuite, elle crée un formulaire avec les contrôles name et avatar en utilisant la méthode group de FormBuilder. Les contrôles ont des validateurs de champs requis,
    de longueur minimale et maximale, et de motif pour le nom d'utilisateur et l'URL de l'avatar. Les valeurs actuelles de l'utilisateur connecté sont également affectées aux champs du formulaire.
Méthodes getter : Les méthodes name et avatar sont des accesseurs qui renvoient les contrôles correspondants du formulaire. Ils sont utilisés pour obtenir la valeur des champs dans la méthode submit.
Méthode submit : La méthode submit est appelée lorsque l'utilisateur soumet le formulaire. Si l'utilisateur actuel existe, elle récupère la valeur des champs de formulaire pour le nom et l'avatar,
    les affecte à l'utilisateur actuel, puis appelle la méthode updateUserState du service AuthService pour mettre à jour l'état de l'utilisateur.
    La méthode subscribe est appelée pour que la mise à jour se fasse de manière asynchrone. 
*/
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

  constructor(private fb: FormBuilder, private authService: AuthService) { }

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

  // getter : méthodes d'accesseur pour obtenir la valeur des champs du formulaire (dans la méthode submit).
  get name() {
    return this.profilForm.get('name') as FormControl;
  }
  get avatar() {
    return this.profilForm.get('avatar') as FormControl;
  }

  // Fonction de soumission du formulaire
  submit(): void {
    if (this.user) {// if user exists:
      // récupére les valeurs des champs de formulaire et les affectent à l'utilisateur actuel.
      this.user.name = this.profilForm.get('name')?.value;
      this.user.avatar = this.profilForm.get('avatar')?.value;

      // Appel d'updateUserState() : MAJ de l'état de l'utilisateur du service AuthService.
      this.authService.updateUserState(this.user).subscribe(); // appel de subscribe() : MAJ de manière asynchrone.
    }
  }
}
