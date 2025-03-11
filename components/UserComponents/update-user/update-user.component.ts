import { Component, inject, OnInit } from '@angular/core';
import { AvatarsComponent } from '../avatars/avatars.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {UsersService} from '../../../services/Users.service';
import {User} from '../../../Model/Interfaces/User';
import {AuthService} from '../../../services/AuthService';
import {emailUniqueValidator, usernameUniqueValidator} from '../../../services/validators';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [AvatarsComponent, CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  usersService = inject(UsersService);
  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);

  id: string | null = null;
  form = this.fb.group({
    id: [{ value: '', disabled: true }], // Deshabilitado ya que es autogenerado
    username: ['', [],[usernameUniqueValidator(this.usersService)]],
    email: ['', [Validators.email],[emailUniqueValidator(this.usersService)]],
    password: ['', []],
  });

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (param) => {
        this.id = param.get('id');
        if (this.id) {
          this.obtainUserById(this.id);
        }
      },
      error: (e: Error) => {
        console.log(e.message);
      }
    });
  }

  obtainUserById(id: string) {
    this.usersService.findUserById(id).subscribe({
      next: (user: User) => {
        this.form.patchValue({
          id: user.id,
          username: user.username,
          email: user.email,
          password: user.password
        });
      },
      error: (e: Error) => {
        console.log(e.message);
      }
    });
  }

  updateUser() {
    if (this.form.invalid) return;

    const user = this.authService.getCurrentUser();
    const formValues = this.form.getRawValue();

    if (formValues.username) {
      user!.username = formValues.username;
    }
    if (formValues.email) {
      user!.email = formValues.email;
    }
    if (formValues.password) {
      user!.password = formValues.password;
    }

    this.usersService.updateUser(user!).subscribe({
      next: () => {
        this.authService.updateSessionUser(user!)
        alert("Your information has been updated correctly")
        this.router.navigateByUrl(''); // Redirige después de la actualización
      },
      error: (e: Error) => {
        console.log(e.message);
      }
    });
  }
}
