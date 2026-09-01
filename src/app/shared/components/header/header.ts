import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { environment } from '../../../../environments/environment';
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

  constructor(
    private router: Router,
    private auth: Auth
  ) {}

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

  async logout(): Promise<void> {
    try {
      if (environment.useFirebaseAuthentication) {
        await signOut(this.auth);
      }
    } finally {
      localStorage.removeItem('usuarioLogado');
      await this.router.navigate(['/login']);
    }
  }
}
