import { Component } from '@angular/core';
import { FooterComponent } from '../../../../shared/components/footer/footer';
import { HeaderComponent } from '../../../../shared/components/header/header';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {}
