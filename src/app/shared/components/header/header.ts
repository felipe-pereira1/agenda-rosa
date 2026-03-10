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
    // 1. Remove os dados do usuário do navegador para que a tela de login não o jogue de volta para a Home
    localStorage.removeItem('usuarioLogado');
    
    // 2. Redireciona para a tela de login
    this.router.navigate(['/login']); 
  }
}