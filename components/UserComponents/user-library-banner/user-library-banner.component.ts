import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../../services/AuthService';
import {User} from '../../../Model/Interfaces/User';
import {userTitle} from '../../../Model/enums/user-titles';
import { DropdownModule } from 'primeng/dropdown';
import {CommonModule} from '@angular/common';


@Component({
  selector: 'app-user-library-banner',
  standalone: true,
  imports: [FormsModule, DropdownModule, CommonModule],
  templateUrl: './user-library-banner.component.html',
  styleUrl: './user-library-banner.component.css'
})
export class UserLibraryBannerComponent {


  user!: User | null;
  constructor(private authService: AuthService) {
    this.user = this.authService.getCurrentUser();
    }

  searchQuery: string = '';

  search() {
    this.user?.library.filter(game => game.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }
}
