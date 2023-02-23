import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Toastr } from 'src/app/shared/models/toastr';
import { ToastrService } from '../../services/toastr.service'; // On réutilise le modèle Toastr

@Component({
  selector: 'al-toastr',
  templateUrl: './toastr.component.html',
  styleUrls: ['./toastr.component.scss']
})
export class ToastrComponent implements OnInit {

  toastr$: Observable<Toastr | null>;  // Flux qui émet soit un Toastr soit null.

  constructor(private toastrService: ToastrService) { }

  ngOnInit() { // lien entre service & composant, en récuperant directement le flux exposé par le service :
    this.toastr$ = this.toastrService.toastr$; // affecte le flux emis par le service toastr au flux interne du composant toastr$.
  }

  closeToastr() { // appelle la méthode closeToastr() sur le service toastr.
    this.toastrService.closeToastr();
  }
}
