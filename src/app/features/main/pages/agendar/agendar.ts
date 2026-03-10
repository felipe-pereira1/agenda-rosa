import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Importações do Firebase Firestore
import { Firestore, collection, query, where, getDocs, addDoc, deleteDoc, doc } from '@angular/fire/firestore';

// Importações do PrimeNG
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

// Seus componentes compartilhados
import { FooterComponent } from '../../../../shared/components/footer/footer';
import { HeaderComponent } from '../../../../shared/components/header/header';
import { agendamentos, TableComponent } from '../../../../shared/components/table/table';

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
  mostrarModalAgendamento: boolean = false;
  tituloDataExtenso: string = '';
  dataAtualDaRota: string = '';
  agendamentosDoDia: any[] = [];
  
  // Guardará o ID da pessoa que está usando o sistema agora
  idUsuarioLogado: string = '';

  novoAgendamento = {
    nome: '',
    hora: '',
    servico: ''
  };

  // Injetando Banco de Dados, Rotas e o Detetor de Mudanças
  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);
  
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // 1. Verifica quem está logado
    const userJson = localStorage.getItem('usuarioLogado');
    if (!userJson) {
      this.router.navigate(['/login']);
      return;
    }
    this.idUsuarioLogado = JSON.parse(userJson).id;

    // 2. Pega a data da URL (ex: '2026-03-18')
    const dataUrl = this.route.snapshot.paramMap.get('data');
    if (dataUrl) {
      this.dataAtualDaRota = dataUrl;
      this.formatarData(dataUrl);
      
      // 3. Busca os dados no banco de dados para essa data
      this.buscarAgendamentosDaRota();
    }
  }

  // Vai no Firebase e busca APENAS os dessa pessoa e dessa data
  async buscarAgendamentosDaRota() {
    try {
      const agendamentosRef = collection(this.firestore, 'agendamentos');
      const q = query(agendamentosRef, 
        where('id_usuario', '==', this.idUsuarioLogado),
        where('data', '==', this.dataAtualDaRota)
      );
      
      const querySnapshot = await getDocs(q);
      const listaTemporaria: any[] = [];
      
      querySnapshot.forEach((doc) => {
        listaTemporaria.push({ id_firebase: doc.id, ...doc.data() });
      });
      
      // Ordenar por hora (opcional mas fica mais bonito na tabela)
      this.agendamentosDoDia = listaTemporaria.sort((a, b) => a.hora.localeCompare(b.hora));

      // Força o Angular a atualizar a tabela imediatamente após receber os dados
      this.cdr.detectChanges();

    } catch (error) {
      console.error("Erro ao buscar agendamentos do banco:", error);
    }
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

  // Salva no Banco de Dados e fecha o modal imediatamente
  async salvarAgendamento() {
    if(this.novoAgendamento.nome && this.novoAgendamento.hora && this.novoAgendamento.servico) {
      
      const agendamentoParaSalvar = {
        nome: this.novoAgendamento.nome,
        hora: this.novoAgendamento.hora,
        servico: this.novoAgendamento.servico,
        data: this.dataAtualDaRota,
        id_usuario: this.idUsuarioLogado // O SEGREDO: Salvar a quem pertence!
      };

      // FECHA O MODAL IMEDIATAMENTE (antes de ir pro Firebase)
      this.mostrarModalAgendamento = false;
      this.limparFormulario();
      this.cdr.detectChanges(); // Avisa a tela que fechamos o modal

      try {
        // Envia para o Firebase
        await addDoc(collection(this.firestore, 'agendamentos'), agendamentoParaSalvar);
        
        // Recarrega a lista da tela
        await this.buscarAgendamentosDaRota();
        
      } catch (error) {
        console.error("Erro ao salvar no banco: ", error);
        alert("Erro ao salvar o agendamento.");
        
        // Se der erro, abre o modal de novo pra pessoa tentar novamente
        this.mostrarModalAgendamento = true;
        this.cdr.detectChanges();
      }
    }
  }

  limparFormulario() {
    this.novoAgendamento = { nome: '', hora: '', servico: '' };
  }

  // Deleta do Banco de Dados
  async removerDaLista(agendamento: any) {
    const confirmar = confirm(`Deseja realmente deletar o agendamento de ${agendamento.nome}?`);
    
    if(confirmar && agendamento.id_firebase) {
      try {
        // Deleta o documento exato no Firebase usando o ID único dele
        await deleteDoc(doc(this.firestore, 'agendamentos', agendamento.id_firebase));
        
        // Recarrega a lista
        await this.buscarAgendamentosDaRota();
      } catch (error) {
        console.error("Erro ao deletar: ", error);
      }
    }
  }
}