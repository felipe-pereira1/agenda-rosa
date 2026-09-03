import { Component } from '@angular/core';
import { FooterComponent } from '../../../../shared/components/footer/footer';
import { HeaderComponent } from '../../../../shared/components/header/header';
import { ServicosModalComponent } from '../../components/servicos-modal/servicos-modal';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, ServicosModalComponent],
  templateUrl: './servicos.html',
  styleUrl: './servicos.css'
})
export class ServicosComponent {
  modalServicoVisivel = false;

  abrirModalServico(): void {
    this.modalServicoVisivel = true;
  }
}
