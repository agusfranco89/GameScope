import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/AuthService';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {User} from '../../../Model/Interfaces/User';
import {UsersService} from '../../../services/Users.service';
import {BannedUserError, InactiveUserError} from '../../../Model/errors/userErrors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder,
              private userService: UsersService) {
    // Inicializar el formulario reactivo
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Validación para el correo electrónico
      password: ['', [Validators.required, Validators.minLength(6)]] // Validación para la contraseña
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, rellena todos los campos correctamente';
      return;
    }

    const { email, password } = this.loginForm.value;
    if (!email || !password) {
      this.errorMessage = 'El campo de correo electrónico o contraseña está vacío.';
      return;
    }

    this.authService.login(email, password).subscribe({
      next: (user) => {
        alert('Inicio de sesión exitoso');
        this.router.navigate(['/']);
      },
      error: (error) => {
        if(error instanceof InactiveUserError){
          if (confirm("You have deactivated your account. Do you wish to reactivate it?")) {
            this.userService.getByEmail(email).subscribe({
              next: (user) => {
                this.userService.switchActiveUser(user).subscribe({
                  next: () => {
                    this.authService.login(email, password).subscribe({
                      next: (user) => {
                        alert('Welcome back!');
                        this.router.navigate(['/']);
                      },
                      error: (loginError) => {
                        this.errorMessage = 'Error al iniciar sesión nuevamente.';
                        console.log(loginError);
                      }
                    });
                  },
                  error: (switchError) => {
                    this.errorMessage = 'Error al reactivar la cuenta.';
                    console.log(switchError);
                  }
                });
              },
              error: (getUserError) => {
                this.errorMessage = 'No se encontró el usuario con el correo especificado.';
                console.log(getUserError);
              }
            });
        }
        }
      if (error instanceof BannedUserError)
      {
      alert('Your account has been suspended. Please contact support.');
      }
      }
    });
  }


  emailError() {
    const control = this.loginForm.get('email');
    return control?.touched && control?.invalid ? 'Email not valid' : null;
  }

  passwordError(){
    const control = this.loginForm.get('password');
    return control?.touched && control?.invalid ? 'Password must be at least 6 characters long' : null;
  }
}

