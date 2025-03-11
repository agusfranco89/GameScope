// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {User} from '../Model/Interfaces/User';
import {Videogame} from '../Model/Interfaces/videogame';
import {UsersService} from './Users.service';
import {BannedUserError, InactiveUserError} from '../Model/errors/userErrors';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/usuarios'; // Ruta de tu JSON Server

  constructor(private http: HttpClient,
              private userService: UsersService) {}

  login(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      map((users) => {
        if (users.length > 0 ) {
          if(users[0].isBanned) {
            throw new BannedUserError();
          }
          if (!users[0].isActive) {
            throw new InactiveUserError();
          }

          const user = users[0]; // Si hay coincidencia, obtén el primer usuario
          localStorage.setItem('currentUser', JSON.stringify(user)); // Almacena el usuario completo
          this.setSessionActive();
          return user;
        }
        throw Error('Credenciales incorrectas');
      })
    );
  }

  setSessionActive() {
    localStorage.setItem('sessionActive', 'true');  // Cambia a sessionStorage si prefieres
  }

  // Método para verificar si la sesión está activa
  isSessionActive(): boolean {
    return localStorage.getItem('sessionActive') === 'true';
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) as User : null;
  }

  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('sessionActive');
    localStorage.removeItem('currentUser');
  }

  updateSessionUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user ? user.isAdmin : false;
  }
}
