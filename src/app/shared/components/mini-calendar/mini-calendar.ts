import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface DiaCalendario {
  nomeDia: string; // Ex: 'Seg.', 'Ter.'
  numeroDia: number; // Ex: 18, 19
  dataCompleta: Date; // A data real que enviaremos pela rota
}

@Component({
  selector: 'app-mini-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-calendar.html',
  styleUrls: ['./mini-calendar.css']
})
export class MiniCalendarComponent implements OnInit {
  proximosDias: DiaCalendario[] = [];

  // Arrays para converter os números dos dias da semana em texto
  diasDaSemana = ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.'];

  constructor(private router: Router) {}

  ngOnInit() {
    this.gerarProximosDias();
  }

  gerarProximosDias() {
    const hoje = new Date();
    
    // Loop para pegar os 5 dias (hoje + 4 próximos)
    for (let i = 0; i < 5; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() + i); // Soma 'i' dias à data de hoje
      
      this.proximosDias.push({
        nomeDia: this.diasDaSemana[data.getDay()], // Pega o nome abreviado
        numeroDia: data.getDate(),                 // Pega o número do dia
        dataCompleta: data                         // Guarda o objeto Data completo
      });
    }
  }

  // Função disparada ao clicar no "quadradinho"
  irParaAgendamentos(diaSelecionado: DiaCalendario) {
    // Formata a data para YYYY-MM-DD para passar na URL (Ex: 2026-03-18)
    const ano = diaSelecionado.dataCompleta.getFullYear();
    const mes = String(diaSelecionado.dataCompleta.getMonth() + 1).padStart(2, '0');
    const dia = String(diaSelecionado.dataCompleta.getDate()).padStart(2, '0');
    const dataFormatada = `${ano}-${mes}-${dia}`;

    // Navega para a rota de agendamentos passando a data como parâmetro
    // Você precisa ter configurado a rota assim: { path: 'agendamentos/:data', ... }
    this.router.navigate(['/agendamentos', dataFormatada]);
  }
}