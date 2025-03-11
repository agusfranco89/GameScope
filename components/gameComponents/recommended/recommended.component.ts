import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterModule} from "@angular/router";
import {AuthService} from '../../../services/AuthService';
import {VideojuegosService} from '../../../services/videojuegos.service';
import {User} from '../../../Model/Interfaces/User';
import {YoutubePlayerComponent} from 'ngx-youtube-player';
import {CommonModule} from '@angular/common';
import {UsersService} from '../../../services/Users.service';

@Component({
  selector: 'app-recommended',
  standalone: true,
  imports: [
    RouterLink,
    YoutubePlayerComponent,
    CommonModule
  ],
  templateUrl: './recommended.component.html',
  styleUrl: './recommended.component.css'
})
export class RecommendedComponent implements OnInit {

  player!: YT.Player;
  user!: User;
  recommendedGames: any[] = [];  // Lista de juegos recomendados
  userLibrary: any[] = [];        // Biblioteca de videojuegos del usuario
  currentIndex: number = 0;

  constructor(private authService: AuthService,
              private videojuegosService: VideojuegosService,
              private userService: UsersService,
              private router: Router,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser()!;
    if (this.user) {
      this.userLibrary = this.user.library;  // La biblioteca de videojuegos del usuario
      this.loadRecommendedGames();
    }
  }

  loadRecommendedGames() {
    const recommended: any[] = [];

    // Recorremos la biblioteca de videojuegos del usuario
    this.userLibrary.forEach((game) => {
      // Para cada videojuego en la biblioteca, recorremos sus juegos similares
      game.similarGames.forEach((similarGameId: string) => {
        // Hacemos la solicitud para obtener el videojuego similar
        this.videojuegosService.getById(similarGameId).subscribe({
          next: (similarGame) => {
            // Si el videojuego está en la respuesta, lo agregamos a la lista de recomendados
            const isGameAlreadyInLibrary = this.user.library.some(game => game.id === similarGame.id);
            const isGameAlreadyRecommended = this.recommendedGames.some(game => game.id === similarGame.id);
            const isGameInUninterested = this.user.uninterestedGamesID.some(gameId => gameId === similarGame.id);
            if (similarGame && !isGameAlreadyInLibrary && !isGameAlreadyRecommended && !isGameInUninterested) {
              recommended.push(similarGame);
            }
          },
          error: (err) => {
            // Si el videojuego no está en el servidor (error 404, por ejemplo), se ignora
          }
        });
      });
    });

    // Esperamos un poco para que todas las solicitudes se completen antes de actualizar la lista recomendada
    setTimeout(() => {
      this.recommendedGames = recommended;
    }, 1000); // Ajusta el tiempo de espera según sea necesario para la cantidad de solicitudes
  }

  savePlayer(player: YT.Player) {
    this.player = player;
  }
  onStateChange(event: any) {
    console.log("player state", event.data);
  }

  addToLibrary(gameId: string) {
    if (!this.userLibrary.includes(this.recommendedGames[this.currentIndex])) {
      // Verificar si el videojuego ya está en la biblioteca
      // Agregar el videojuego si no está presente
      this.user.library.push(this.recommendedGames[this.currentIndex]);
      this.userService.updateUser(this.user).subscribe();
      this.authService.updateSessionUser(this.user);

      //Avanza el index
      this.currentIndex++;
      this.player.loadVideoById(this.recommendedGames[this.currentIndex].idVideo);
      alert("Juego agregado a tu biblioteca.");

      this.cdr.detectChanges();

    } else {
      alert('Este juego ya está en tu biblioteca');
    }
  }

  // Ir a la siguiente recomendación
  nextRecommendation() {
    if (this.currentIndex < this.recommendedGames.length - 1) {


      this.user.uninterestedGamesID.push(this.recommendedGames[this.currentIndex].id);
      this.userService.updateUser(this.user).subscribe();
      this.authService.updateSessionUser(this.user);

      this.recommendedGames.filter((game) => game.id !== this.recommendedGames[this.currentIndex].id);



      this.currentIndex++;
      this.player.loadVideoById(this.recommendedGames[this.currentIndex].idVideo);
      this.cdr.detectChanges();



      } else {
      this.user.uninterestedGamesID.push(this.recommendedGames[this.currentIndex].id);
      this.userService.updateUser(this.user).subscribe();
      this.authService.updateSessionUser(this.user);

        alert('No quedan recomendaciones');
        this.router.navigate(["/home"]);
      }
    }
  }

