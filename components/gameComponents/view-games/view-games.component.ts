import {Component, OnInit} from '@angular/core';
import {Videogame} from '../../../Model/Interfaces/videogame';
import {VideojuegosService} from '../../../services/videojuegos.service';
import {AuthService} from '../../../services/AuthService';
import {UsersService} from '../../../services/Users.service';
import {User} from '../../../Model/Interfaces/User';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-view-games',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './view-games.component.html',
  styleUrl: './view-games.component.css'
})
export class ViewGamesComponent implements OnInit {
  videojuegos: Videogame[] = [];
  constructor(private videojuegosService: VideojuegosService,
              private userService: UsersService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.videojuegosService.get();
    this.videojuegosService.videogames$.subscribe((videogames) => {
      this.videojuegos = videogames;
    });
  }

  addVideogame(videogame: Videogame) {
    if(this.authService.isSessionActive()){
      const user = this.authService.getCurrentUser();


      // Verificar si el videojuego ya está en la biblioteca
      const isAlreadyInLibrary = user?.library.some(game => game.id === videogame.id);

      if (isAlreadyInLibrary) {
        alert("Este juego ya está en tu biblioteca.");
      } else {
        // Agregar el videojuego si no está presente
        user?.library.push(videogame);
        this.userService.updateUser(user!).subscribe();
        this.authService.updateSessionUser(user!);
        alert("Juego agregado a tu biblioteca.");
      }
    }else{
      alert("Debe estar registrado para agregar juegos a la biblioteca.");
    }
  }

}
