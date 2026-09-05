import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../../feature/header/header.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {}
