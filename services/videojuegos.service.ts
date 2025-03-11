import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Videogame} from '../Model/Interfaces/videogame';
import {BehaviorSubject, catchError, EMPTY, map, Observable, tap} from 'rxjs';
import {VideogameGenres} from '../Model/enums/videogame-genres';
import {VideoGamePlatform} from '../Model/enums/videogamePlatform';
import {Game} from '../Model/Interfaces/game';
import {switchMap} from 'rxjs/operators';
import { environment } from '../environments/environment.development';
import { Review } from '../Model/Interfaces/Review';

@Injectable({
  providedIn: 'root'
})
export class VideojuegosService {

  videogamesSubject: BehaviorSubject<Videogame[]> = new BehaviorSubject<Videogame[]>([]);
  videogames$: Observable<Videogame[]> = this.videogamesSubject.asObservable();

  urlBase = environment.urlBase;
  constructor(private http: HttpClient) { }

  get() {
    this.http.get<Videogame[]>(this.urlBase).pipe(
      tap((data) => this.videogamesSubject.next(data)),
      catchError((error) => {
        console.error(error);
        return [];
      })
    ).subscribe();
  }

 getById(id: string): Observable<Videogame> {
   return this.http.get<Videogame>(`${this.urlBase}/${id}`);
 }
  getFiltered(genre?: VideogameGenres, platform?: VideoGamePlatform, title?: string) {
    return this.http.get<Videogame[]>(this.urlBase).pipe(
      map((videogames) => videogames.filter((game) => {
        let matches = true;

        if (genre) {
          matches = matches && game.genres.includes(genre);
        }
        if (platform) {
          matches = matches && game.platforms.includes(platform);
        }
        if (title) {
          matches = matches && game.title.toLowerCase().includes(title.toLowerCase());
        }

        return matches;
      })),
      tap((filteredGames) => {
        this.videogamesSubject.next(filteredGames);
      })
    );
  }

  post(game:Game): Observable<Videogame> {
    const videogame: Videogame = this.convertGametoVideogame(game)

    // Primero, verificamos si el juego ya existe en la API mediante su id
    return this.http.get<Videogame>(`${this.urlBase}/${videogame.id}`).pipe(
      // Si el juego ya existe, lanzamos un error o devolvemos un observable vacío
      switchMap(existingGame => {
        if (existingGame) {
          // Aquí lanzamos un error si el juego ya existe
          throw new Error('El juego ya existe en la API');
        }
        return EMPTY;
      }),
      // Si el juego no existe, realizamos el POST
      catchError(err => {
        if (err.status === 404) { // 404 significa que el juego no se encontró, entonces se puede crear
          return this.http.post<Videogame>(this.urlBase, videogame).pipe(
            tap((nuevoJuego) => {
              const videojuegos = this.videogamesSubject.getValue();
              this.videogamesSubject.next([...videojuegos, nuevoJuego]);
            })
          );
        }
        // Si hay otro tipo de error, lo lanzamos
        throw err;
      })
    );
  }

  put(videogame: Videogame) {
    this.http.put<Videogame>(`${this.urlBase}/${videogame.id}`, videogame).pipe(
      tap((data) => {
        const peliculasActuales = this.videogamesSubject.value.map(
          v => v.id === videogame.id ? videogame : v
        );
        this.videogamesSubject.next(peliculasActuales);
      }),
      catchError((error) => {
        console.error(error);
        return [];
      })
    ).subscribe();
  }

  convertGametoVideogame(game: Game): Videogame {
    return {
      id: game.id,
      title: game.titulo,
      companies: game.empresas,
      image: game.imagen,
      genres: game.generos.map(genre => genre as VideogameGenres),  // Asegúrate de que los géneros correspondan a VideogameGenres
      storyline: game.storyline,
      ageRating: "E",  // Valor predeterminado para el campo ageRating, puede personalizarse
      globalScore: 0,  // Inicializa el puntaje global en 0
      releaseDate: game.fechaLanzamiento,  // Valor predeterminado; podrías cambiarlo si tienes una fecha específica
      platforms: game.plataformas.map(platform => platform as VideoGamePlatform),  // Conversión de plataformas
      reviews: [],  // Inicializa con una lista vacía de reseñas
      similarGames: game.similarGames.map((id) => id.toString()),  // Inicializa con una lista vacía de juegos similares
      idVideo: game.videos[0] || ''  // Toma el primer video, si está presente, o usa un string vacío
    }
  }
}
