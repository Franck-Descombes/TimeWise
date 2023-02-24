/* le service error s’occupe simplement de :
Appeler le service toastr, pour afficher le message d’erreur à l’utilisateur.
Retourner l’erreur levée, grâce à l’opérateur throwError de la librairie RxJS.
Cet opérateur retourne un Observable qui émet seulement l’erreur en question, puis plus rien.
Cela permet de lever l’erreur sans faire planter votre application, tout en vous laissant la possibilité de traiter ce flux plus tard.
*/
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { ToastrService } from './toastr.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private toastrService: ToastrService) { }

  /* Utiliser le mot-clé de secours any, qui permettra de lever des erreurs quel que soit le type du backend utilisé.
  Dans le cas où nous aurions le contrôle sur notre backend, nous pourrions directement appliquer le type correspondant à la place de any.*/
  handleError(error: any) {
    this.toastrService.showToastr({
      category: 'danger',
      message: error.error.error.message
    });
    return throwError(error);
  }
}