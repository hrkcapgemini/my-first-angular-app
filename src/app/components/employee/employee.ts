import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './employee.html',
  styleUrl: './employee.css',
})
export class Employee {}
