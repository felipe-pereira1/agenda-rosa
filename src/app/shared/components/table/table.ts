import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

export interface agendamentos {
  nome: string;
  hora: string;
  servico: string;
  data: string;
}

@Component({
  selector: 'app-agendamentos-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './table.html',
  styleUrls: ['./table.css']
})
export class TableComponent {
  // O componente pai (Home ou Agendar) passará a lista para cá
  @Input() agendamentos: agendamentos[] = [];

  @Input() mostrarAcoes: boolean = true; 

  @Output() onDeletar = new EventEmitter<agendamentos>();

  // Função chamada pelo botão no HTML
  clicouDeletar(agendamento: agendamentos) {
    this.onDeletar.emit(agendamento);
  }
}