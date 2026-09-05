import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../header/header.component';
import { Sibling1 } from './sibling/sibling1/sibling1';
import { Sibling2 } from './sibling/sibling2/sibling2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HeaderComponent, Sibling1, Sibling2],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  readonly authService = inject(AuthService);

  get user() {
    return this.authService.getCurrentUser();
  }
}
