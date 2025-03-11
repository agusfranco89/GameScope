import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {User} from '../Model/Interfaces/User';
import {userTitle} from '../Model/enums/user-titles';
import {environment} from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUsers = environment.apiUsers;

  constructor(private http: HttpClient) { }

  findUsersByName(username: string): Observable<User[]> {
    return this.http.get<User[]>(this.apiUsers).pipe(
      map(users => users.filter(user =>
        user.username.toLowerCase().includes(username.toLowerCase()) && user.isActive
      ).map(user => ({
        ...user,
        currentTitle: userTitle[user.currentTitle as keyof typeof userTitle] // Convertir string a enum
      })))
    );
  }

  findUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUsers}/${id}`);
  }

  getByEmail(email: string): Observable<User>{
    return this.http.get<User[]>(`${this.apiUsers}?email=${email}`)
      .pipe(
        map(users => {
          console.log('Usuarios encontrados:', users);
          if (users && users.length > 0) {
            return users[0]; // Retornamos el primer usuario que coincida
          } else {
            throw new Error('Usuario no encontrado');
          }
        })
      );
  }

  isUsernameTaken(username: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUsers}?username=${username}`).pipe(
      map(users => users.length > 0)
    );
  }

  isEmailTaken(email: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUsers}?email=${email}`).pipe(
      map(users => users.length > 0)
    );
  }

  registerUser(user: User): Observable<User>{
    return this.http.post<User>(this.apiUsers, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUsers}/${user.id}`, user);
  }

  banUser(user: User): Observable<User>{
    user.isActive = false;
    user.isBanned = true;

    return this.http.put<User>(`${this.apiUsers}/${user.id}`, user);
  }

  switchActiveUser(user: User): Observable<User>{
    user.isActive = !user.isActive;

    return this.http.put<User>(`${this.apiUsers}/${user.id}`, user);
  }

  getAllUsers():Observable<User[]>{
  return this.http.get<User[]>('http://localhost:3000/usuarios');
  }
}
