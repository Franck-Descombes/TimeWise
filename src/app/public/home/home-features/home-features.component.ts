import { Component } from '@angular/core';

@Component({
  selector: 'al-home-features',
  templateUrl: './home-features.component.html',
  styles: [
  ]
})
export class HomeFeaturesComponent {
  // Le type "features" peut sembler complexe, il s'agit surtout d'une lourdeur de syntaxe.
  // Idéalement, on pourrait créer une interface Feature pour représenter ce type.
  // Mais ici on va plutôt se concentrer sur l'interaction entre les composants...
  features: { title: string, description: string, icon: string }[];

  constructor() { }

  ngOnInit() {
    /* On initialise une propriété 'features' qui est un Tab contenant les données des 3 fonctionnalités que l’on souhaite afficher.
    Pour chacune d'elle, nous passons le titre, la description et une icône. 
    */
    this.features = [
      {
        title: 'Planifier sa semaine',
        description: 'Visibilité sur les 7 prochains jours',
        icon: 'assets/img/calendar.svg'
      },
      {
        title: 'Atteindre ses objectifs',
        description: 'Priorisation des tâches',
        icon: 'assets/img/award.svg'
      },
      {
        title: 'Analyser sa productivité',
        description: 'Visualiser le travail accompli',
        icon: 'assets/img/diagram.svg'
      }
    ]
  }
}
