import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePickerModule } from 'primeng/datepicker';
import { FooterComponent } from '../../../../shared/components/footer/footer';
import { HeaderComponent } from '../../../../shared/components/header/header';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, FormsModule, FooterComponent, HeaderComponent, DatePickerModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class CalendarComponent {
  dataSelecionada: Date | undefined;

  constructor(private router: Router) {}

  aoSelecionarData(data: Date) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const dataFormatada = `${ano}-${mes}-${dia}`;

    console.log('Dia clicado:', dataFormatada);

    this.router.navigate(['/agendamentos', dataFormatada]);
  }
}