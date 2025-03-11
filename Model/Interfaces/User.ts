import {userTitle} from '../enums/user-titles';
import {Achievement} from './Achievement';
import {Review} from './Review';
import {Videogame} from './videogame';

export interface User {
  id: string;
  isAdmin: boolean;
  isActive: boolean;
  isBanned: boolean;
  username: string;
  followers: number;
  following: string[];
  karma: number;
  email: string;
  password: string;
  currentTitle: userTitle;
  titles: userTitle[];
  img: string;
  achievements: Achievement[];
  reviews: Review[];
  notificaciones: string[];
  library: Videogame[];
  uninterestedGamesID: string[];
}

