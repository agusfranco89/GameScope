import {AfterViewInit, Component, HostListener} from '@angular/core';
import {AuthService} from '../../services/AuthService';
import {RouterModule} from '@angular/router';
import {User} from '../../Model/Interfaces/User';
declare var bootstrap: any;

@Component({
  selector: 'app-sidebar-usuario',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar-usuario.component.html',
  styleUrl: './sidebar-usuario.component.css'
})
export class SidebarUsuarioComponent implements AfterViewInit{
  sidebarVisible = false; // Controla la visibilidad
  user: User | null = null;
  constructor(public authService: AuthService) {
    this.user = this.authService.getCurrentUser();
  }



  ngAfterViewInit() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    console.log(this.user);
  }


  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const mouseX = event.clientX;

    // Mostrar el sidebar si el mouse está en los primeros 30px de la pantalla
    if (mouseX < 30) {
      this.sidebarVisible = true;
    } else if (mouseX > 80) { // Ocultar el sidebar si el mouse se aleja
      this.sidebarVisible = false;
    }
  }


}
