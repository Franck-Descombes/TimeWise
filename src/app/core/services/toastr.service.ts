import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { Toastr } from 'src/app/shared/models/toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrService {

  private toastr: BehaviorSubject<Toastr | null> = new BehaviorSubject<Toastr | null> ({
    category: 'info',
    message: 'Come on Fox! the Truth Is Out There'
  });
  readonly toastr$: Observable<Toastr | null> = this.toastr.asObservable(); // flux auquel les composants peuvent s'abonner.

  constructor() { }

  // showToastr modifie l’état du service de manière à afficher un toastr mais 3s plus tard, l’état du service sera redéfini à null, le toastr sera donc masqué.
  // 'timer' crée un nouveau flux à partir de certains paramètres.
  // 'take' modifie un flux déjà existant en le raccourcissant un peu.
  showToastr(toastr: Toastr): void {
    timer(0, 3000).pipe(take(2)).subscribe(i => {
      if (i === 0) {
        this.toastr.next(toastr);
      } else {
        this.toastr.next(null);
      }
    });
  }

  // modifier l’état de notre service, en lui passant la valeur null. Le toastr sera donc immédiatement masqué de l’interface.
  public closeToastr(): void {
    this.toastr.next(null);
  }
}
