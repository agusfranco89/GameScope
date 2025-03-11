import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {User} from '../../../Model/Interfaces/User';
import {userTitle} from '../../../Model/enums/user-titles';
import {avatars} from '../../../assets/user-icons/userAvatars';
import {UsersService} from '../../../services/Users.service';
import {emailUniqueValidator, usernameUniqueValidator} from '../../../services/validators';

@Component({
  selector: 'app-form-register',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.css'] // Corrige el typo 'styleUrl' a 'styleUrls'
})
export class FormRegisterComponent {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router,
              private usersService: UsersService) {
    // Definir el formulario usando FormBuilder
    this.registrationForm = this.fb.group({
      mail: ['', [Validators.required, Validators.email],[emailUniqueValidator(this.usersService)]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
      repeatpass: ['', [Validators.required]],
      username: ['', [Validators.required],[usernameUniqueValidator(this.usersService)]],
      privacyPolicy: [false, Validators.requiredTrue] // Debe ser true para ser válido
    }, { validators: this.passwordsMatchValidator });
  }

  // Validador para verificar que las contraseñas coincidan
  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('pass')?.value;
    const repeatPassword = form.get('repeatpass')?.value;
    return password === repeatPassword ? null : { mismatch: true };
  }

  // Validación para enviar el formulario
  onSubmit() {
    if (this.registrationForm.valid) {

      const formValues = this.registrationForm.value;

      // Selecciona solo los campos necesarios para crear el objeto User
      const user: User = {
        id: formValues.id,
        isAdmin: false,
        isActive: true,
        isBanned: false,
        username: formValues.username,
        followers: 0,
        following: [],
        karma: 0,
        password: formValues.pass,
        email: formValues.mail,
        currentTitle: userTitle.Newbie,
        titles: [userTitle.Newbie],
        img: avatars.find(avatar => avatar.name === "Baby Seal")?.url || '',
        achievements: [],
        reviews: [],
        notificaciones: [],
        library: [],
        uninterestedGamesID: []
      };


      // Lógica para manejar el envío del formulario
      this.usersService.registerUser(user).subscribe({
          next: () => {
            alert("Registro exitoso");
          this.router.navigate(['login'])}, // Remplazar por home
          error: (error) => {alert("Ha habido un error en su registro. Por favor vuelva a intentarlo mas tarde")}
      }

      );
    } else {
      console.log('Formulario inválido');
      this.registrationForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores
    }
  }

  // Métodos para mostrar mensajes de error
  get emailError() {
    const control = this.registrationForm.get('mail');
    return control?.touched && control?.invalid ? 'Correo no válido' : null;
  }

  get passwordError() {
    const control = this.registrationForm.get('pass');
    const formError = this.registrationForm.errors?.['mismatch'];
    if (control?.touched && control?.invalid) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return formError ? 'Las contraseñas no coinciden' : null;
  }

  get usernameError() {
    const control = this.registrationForm.get('username');
    return control?.touched && control?.invalid ? 'El nombre de usuario es obligatorio' : null;
  }

  openLogin() {
    this.router.navigate(['login']);
  }
}
