import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Importações do PrimeNG
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

// Seus componentes compartilhados
import { FooterComponent } from '../../../../shared/components/footer/footer';
import { HeaderComponent } from '../../../../shared/components/header/header';
import { agendamentos, TableComponent } from '../../../../shared/components/table/table';

// IMPORTANTE: Importe o Service que criamos
import { AgendamentoService } from '../../../../shared/services/agendamento';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    DialogModule, 
    ButtonModule, 
    InputTextModule, 
    HeaderComponent, 
    FooterComponent, 
    TableComponent,
  ],
  templateUrl: './agendar.html',
  styleUrls: ['./agendar.css']
})
export class AgendarComponent implements OnInit {
  // Controle do modal
  mostrarModalAgendamento: boolean = false;

  // Variável para exibir o texto formatado no topo
  tituloDataExtenso: string = '';

  // Variável para guardar a data pura (ex: 2026-03-08) para salvar no banco/service
  dataAtualDaRota: string = '';

  // Lista vazia que será preenchida pelo Service
  agendamentosDoDia: agendamentos[] = [];

  // Objeto para o novo agendamento que será criado no modal
  novoAgendamento = {
    nome: '',
    hora: '',
    servico: '', // Notei que você mudou 'produto' para 'servico' aqui, o que faz sentido!
  };

  // 1. Injete o AgendamentoService no construtor
  constructor(
    private route: ActivatedRoute,
    private agendamentoService: AgendamentoService
  ) {}

  ngOnInit() {
    // Pega a data da URL (ex: '2026-03-18')
    const dataUrl = this.route.snapshot.paramMap.get('data');
    
    if (dataUrl) {
      this.dataAtualDaRota = dataUrl;
      this.formatarData(dataUrl);
    }

    // 2. Inscrever-se no serviço para ouvir os dados
    this.agendamentoService.agendamentos$.subscribe(listaGlobal => {
      // Filtra a lista global mostrando apenas os agendamentos da data desta página
      this.agendamentosDoDia = listaGlobal.filter(agend => agend.data === this.dataAtualDaRota);
    });
  }

  formatarData(dataString: string) {
    const dataObj = new Date(dataString + 'T12:00:00'); 
    
    const diasSemana = ['Domingo', 'Segunda Feira', 'Terça Feira', 'Quarta Feira', 'Quinta Feira', 'Sexta Feira', 'Sábado'];
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const diaSemana = diasSemana[dataObj.getDay()];
    const diaMes = dataObj.getDate();
    const mes = meses[dataObj.getMonth()];
    const ano = dataObj.getFullYear();

    this.tituloDataExtenso = `${diaSemana} - ${diaMes} de ${mes} de ${ano}`;
  }

  abrirModal() {
    this.mostrarModalAgendamento = true;
  }

  cancelarAgendamento() {
    this.mostrarModalAgendamento = false;
    this.limparFormulario();
  }

  // 3. Atualize o salvarAgendamento
  salvarAgendamento() {
    if(this.novoAgendamento.nome && this.novoAgendamento.hora && this.novoAgendamento.servico) {
      
      // Cria o objeto completo incluindo a data da página
      const agendamentoParaSalvar: agendamentos = {
        nome: this.novoAgendamento.nome,
        hora: this.novoAgendamento.hora,
        servico: this.novoAgendamento.servico,
        data: this.dataAtualDaRota 
      };

      // Manda o serviço guardar o dado globalmente
      this.agendamentoService.adicionarAgendamento(agendamentoParaSalvar);

      this.mostrarModalAgendamento = false;
      this.limparFormulario();
    }
  }

  limparFormulario() {
    this.novoAgendamento = { nome: '', hora: '', servico: '' };
  }

  // Adicione esta função na sua classe AgendarComponent
  removerDaLista(agendamento: agendamentos) {
    // Você pode colocar um "confirm" do navegador se quiser
    const confirmar = confirm(`Deseja realmente deletar o agendamento de ${agendamento.nome}?`);
    
    if(confirmar) {
      this.agendamentoService.deletarAgendamento(agendamento);
    }
  }
}