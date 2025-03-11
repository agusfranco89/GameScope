import { Component, OnInit } from '@angular/core';
import { User } from '../../../Model/Interfaces/User';
import { FormsModule } from '@angular/forms';
import { AvatarsComponent } from '../avatars/avatars.component';
import { CommonModule } from '@angular/common';
import { Avatar } from '../../../Model/Interfaces/avatar.interface';
import { AuthService } from '../../../services/AuthService';
import { UsersService } from '../../../services/Users.service';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {userTitle} from '../../../Model/enums/user-titles';
import {LogrosUserComponent} from '../logros-user/logros-user.component';

@Component({
  selector: 'app-info-user',
  standalone: true,
  imports: [AvatarsComponent, CommonModule, FormsModule, RouterModule, LogrosUserComponent],
  templateUrl: './info-user.component.html',
  styleUrls: ['./info-user.component.css']
})
export class InfoUserComponent implements OnInit {
  user!: User;
  imageUrl: string = 'https://via.placeholder.com/150';
  showAvatars: boolean = false; // Para controlar si se muestran los avatares
  isCurrentUser: boolean = false;
  isFollowing: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit() {

    // Obtener el parámetro `userId` de la ruta si existe
    const userId = this.route.snapshot.paramMap.get('userId');

    this.isAdmin = this.authService.isAdmin();

    if (userId) {
      // Si `userId` está presente, cargar otro usuario
      this.userService.findUserById(userId).subscribe(
        (user) => {
          this.user = user;
          this.imageUrl = user.img || this.imageUrl; // Actualiza la imagen después de asignar el usuario
          this.checkIfFollowing(userId)
        },
        (error) => {
          console.error('Error al cargar el usuario:', error);
          this.initializeDefaultUser(); // Llama al método para inicializar el usuario por defecto si falla
        }
      );
    }
    if(!userId) {
      // Si no hay `userId`, cargar el usuario actual
      this.user = this.authService.getCurrentUser() as User;
      console.log(this.user);
      this.isCurrentUser = true;

      if (!this.user) {
        this.initializeDefaultUser(); // Si no hay usuario actual, inicializa el usuario por defecto
      }

      this.imageUrl = this.user.img;
    }
  }

  // Método para inicializar un usuario por defecto
  private initializeDefaultUser() {
    // Crea un usuario por defecto aquí
    this.user = {
      id: 'defaultId', // Cambia esto al ID que quieras asignar por defecto
      username: 'Usuario por Defecto', // Cambia esto al nombre de usuario por defecto
      img: "https://via.placeholder.com/150",
      isAdmin: false,
      isActive: true,
      isBanned: false,
      titles: [userTitle.Newbie],
      currentTitle: userTitle.Newbie,
      achievements: [],
      reviews: [],
      followers: 0,
      following: [],
      karma: 0,
      password: 'defaultPassword', // Cambia esto a tu contraseña por defecto
      email: 'defaultEmail', // Cambia esto a tu correo por defecto
      notificaciones: [],
      library: [],
      uninterestedGamesID: []
    };
  }

  // Método para mostrar/ocultar los avatares
  toggleAvatarSelection() {
    this.showAvatars = !this.showAvatars;
  }

  // Método para seleccionar un avatar
  onAvatarSelected(avatar: Avatar) {
    this.imageUrl = avatar.url;
    localStorage.setItem('profileImage', avatar.url); // Guarda la imagen seleccionada
    this.user.img = avatar.url;
    this.userService.updateUser(this.user).subscribe();
    this.authService.updateSessionUser(this.user);
    this.showAvatars = false;
  }

  // Método para seleccionar una imagen personalizada
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        this.imageUrl = imageUrl;
        localStorage.setItem('profileImage', imageUrl); // Guarda la imagen seleccionada
      };
      reader.readAsDataURL(file);
    }
  }

  checkIfFollowing(userID: string) {
    const thisUser = this.authService.getCurrentUser();
    this.isFollowing = thisUser ? thisUser.following.includes(userID) : false;
  }

  followUser() {
    if(this.authService.isSessionActive()) {
      const thisUser = this.authService.getCurrentUser();
      if (thisUser) {
        if (!thisUser.following.includes(this.user.id)) {
          thisUser.following.push(this.user.id);
          this.authService.updateSessionUser(thisUser);
          this.userService.updateUser(thisUser).subscribe();

          //Update the followers of the followed user
          this.user!.followers = this.user!.followers + 1;
          this.userService.updateUser(this.user!).subscribe();

          this.isFollowing = true;
          alert("User followed succesfully.");
        } else {
          alert("You already follow this user");
        }
      }
    }
  }

  unfollowUser() {
    if (this.authService.isSessionActive()) {
      const thisUser = this.authService.getCurrentUser();
      if (thisUser) {
        const index = thisUser.following.indexOf(this.user.id);
        if (index !== -1) {
          thisUser.following.splice(index, 1);
          this.authService.updateSessionUser(thisUser);
          this.userService.updateUser(thisUser).subscribe();

          //Update the followers of the followed user
          this.user!.followers = this.user!.followers - 1;
          this.userService.updateUser(this.user!).subscribe();

          this.isFollowing = false;
          alert("User unfollowed succesfully.");
        }
      }
    }
  }

  banUser() {

    if (confirm("Are you sure you want to delete this user for violating policies?")) {
      this.userService.banUser(this.user).subscribe({
        next: () => {
          alert("User has been blocked for violating policies.");
          console.log('User successfully deleted');
          this.router.navigate(['/home']);
        },
        error: (e: Error) => {
          console.error("Error deleting user:", e.message);
        }
      });
    }
  }

  deactivateAccount(){
    if (confirm("Are you sure you want to deactivate your account?")) {
      this.userService.switchActiveUser(this.user).subscribe({
        next: () => {
          alert("User has been deactivated");
          this.authService.logout();
          this.router.navigate(['/home']);
        },
        error: (e: Error) => {
          console.error("Error deleting user:", e.message);
        }
      });
    }
  }

  changeTitle(newTitle: userTitle ) {
    this.user.currentTitle = newTitle;
    this.authService.updateSessionUser(this.user);
    this.userService.updateUser(this.user).subscribe();
  }


  protected readonly userTitle = userTitle;
}
