import { Component } from '@angular/core';
import {AuthService} from '../../../services/AuthService';
import {User} from '../../../Model/Interfaces/User';
import {Videogame} from '../../../Model/Interfaces/videogame';
import {UsersService} from '../../../services/Users.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-user-library',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './user-library.component.html',
  styleUrl: './user-library.component.css'
})
export class UserLibraryComponent {

  user!: User | null;
  constructor(private authService: AuthService,
              private userService: UsersService) {
    this.user= this.authService.getCurrentUser();
  }

  removeVideogame(videogame: Videogame) {
    const gameIndex = this.user!.library.findIndex(game => game.id === videogame.id);

    this.user!.library.splice(gameIndex, 1);

    this.userService.updateUser(this.user!).subscribe(() => {
      // Actualizar la sesión con los datos del usuario actualizados
      this.authService.updateSessionUser(this.user!);
      alert("Juego eliminado de tu biblioteca.");
    });
  }
}
