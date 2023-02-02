import { Component, Input } from '@angular/core';

@Component({
  selector: 'al-home-feature-card',
  templateUrl: './home-feature-card.component.html',
  styles: [
  ]
})
// Permet de définir les propriétés attendues par le composant sans qu’il doive les récupérer par lui-même.
export class HomeFeatureCardComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() description: string = '';
}
