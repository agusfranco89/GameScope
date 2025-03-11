import {VideogameGenres} from '../enums/videogame-genres';
import {VideoGamePlatform} from '../enums/videogamePlatform';
import {Review} from './Review';

export interface Videogame {
  id: string;
  title: string;
  companies: string[];
  image: string;
  genres: VideogameGenres[];
  storyline: string;
  ageRating: string;
  globalScore: number;
  releaseDate: string;
  platforms: VideoGamePlatform[];
  reviews: Review[];
  similarGames: string[];
  idVideo: string;
}
