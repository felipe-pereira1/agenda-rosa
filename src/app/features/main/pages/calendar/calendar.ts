import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePickerModule } from 'primeng/datepicker';
import { FooterComponent } from '../../../../shared/components/footer/footer';
import { HeaderComponent } from '../../../../shared/components/header/header';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, FormsModule,FooterComponent, HeaderComponent, DatePickerModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class CalendarComponent {
  // Variável que guarda a data (embora não vamos usar para formulário, o PrimeNG precisa)
  dataSelecionada: Date | undefined;

  constructor(private router: Router) {}

  // Função disparada quando um dia é clicado
  aoSelecionarData(data: Date) {
    // Formata a data para YYYY-MM-DD
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const dataFormatada = `${ano}-${mes}-${dia}`;

    console.log("Dia clicado:", dataFormatada);

    // Redireciona para a rota 'agendamentos/:data'
    this.router.navigate(['/agendamentos', dataFormatada]);
  }
}

