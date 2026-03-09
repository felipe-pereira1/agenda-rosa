import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MenuModule, ButtonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {
  // Recebe o título da página que chamar o header
  @Input() titulo: string = 'Início'; 

  // Itens do menu hambúrguer
  menuItems: MenuItem[] | undefined;

  constructor(private router: Router) {}

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Sair',
        icon: 'pi pi-sign-out', // Ícone do PrimeNG
        command: () => {
          this.logout();
        }
      }
    ];
  }

  logout() {
    // Aqui você também pode limpar tokens do localStorage se houver:
    // localStorage.removeItem('token');
    
    // Redireciona para o login
    this.router.navigate(['/login']); 
  }
}