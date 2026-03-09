import { Component } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header';
import { FooterComponent } from '../../../../shared/components/footer/footer';
import { TableComponent } from '../../../../shared/components/table/table';
import { MiniCalendarComponent } from '../../../../shared/components/mini-calendar/mini-calendar';
import { AgendamentoService } from '../../../../shared/services/agendamento';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, FooterComponent, TableComponent, MiniCalendarComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {

  diaAtual: number = 1; // Variável que guardará o dia
  agendamentosDoDia: any[] = [];

  constructor(private agendamentoService: AgendamentoService) {}

  ngOnInit() {
    // Pegar a data de hoje formatada como 'YYYY-MM-DD'
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    const hojeFormatado = `${ano}-${mes}-${dia}`;
    
    this.diaAtual = hoje.getDate();

    // Fica escutando o serviço global
    this.agendamentoService.agendamentos$.subscribe(listaGeral => {
      // Só mostra na Home se a data do agendamento for hoje
      this.agendamentosDoDia = listaGeral.filter(a => a.data === hojeFormatado);
    });
  }
}