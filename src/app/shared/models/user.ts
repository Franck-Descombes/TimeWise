export class User {
    readonly id: string|null; // id de l’utilisateur 'string' ou 'null'
    email: string;
    name: string;
    avatar: string; // url vers la photo de profil de l’utilisateur
    pomodoroDuration: number; // durée des pomodoros
     
// L'opérateur "?" "opérateur de navigation sécurisée" ou "opérateur de coalescence nulle".
// Il est utilisé pour accéder à une propriété d'un objet potentiellement null ou undefined, sans provoquer d'erreur de type "Cannot read property 'x' of null" ou "Cannot read property 'x' of undefined".
    constructor(options: {
     id?: string,
     email?: string,
     name?: string,
     avatar?: string,
     pomodoroDuration?: number,
    } = {}) {
     this.id = options.id || null;
     this.email = options.email || '';
     this.name= options.name || '';
     this.avatar = options.avatar || '';
     this.pomodoroDuration = options.pomodoroDuration || 1500;
    }
    
    get roles(): string[] { // Les rôles sont représentés par un tableau de string.
     return this.email.endsWith('google.com') ? ['USER', 'EMPLOYEE'] : ['USER'];
    }
   }