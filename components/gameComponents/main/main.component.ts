import {Component, OnInit} from '@angular/core';
import {VideojuegosService} from '../../../services/videojuegos.service';
import {Videogame} from '../../../Model/Interfaces/videogame';
import {AuthService} from '../../../services/AuthService';
import {UsersService} from '../../../services/Users.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  videojuegos: Videogame[] = [];
  constructor(private videojuegosService: VideojuegosService,
              private authService: AuthService,
              private userService: UsersService) {
  }

  ngOnInit() {
    this.videojuegosService.get();
    this.videojuegosService.videogames$.subscribe({
      next: (videojuegos) => {
        this.videojuegos = videojuegos.slice(-12);
      }
    })
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
