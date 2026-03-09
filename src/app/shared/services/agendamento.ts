import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { agendamentos } from '../components/table/table';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  
  // Lista vazia por padrão
  private agendamentosIniciais: agendamentos[] = [];
  private agendamentosSubject = new BehaviorSubject<agendamentos[]>([]);
  
  agendamentos$ = this.agendamentosSubject.asObservable();

  constructor() {
    this.carregarDoLocalStorage();
  }

  // Puxa os dados salvos quando o aplicativo abre (ou quando dá F5)
  private carregarDoLocalStorage() {
    const dadosSalvos = localStorage.getItem('agendamentos_app');
    
    if (dadosSalvos) {
      // Se tiver algo salvo, converte de String para Array e joga no Subject
      const listaConvertida = JSON.parse(dadosSalvos);
      this.agendamentosSubject.next(listaConvertida);
    } else {
      // Se não tiver nada, podemos colocar seus dados de teste iniciais
      const dadosMockados: agendamentos[] = [
        { nome: 'Maria Helena', hora: '13:45', servico: 'Sobrancelha', data: '2026-03-08' },
        { nome: 'Bruna Azevedo', hora: '14:30', servico: 'Manicure', data: '2026-03-08' }
      ];
      this.agendamentosSubject.next(dadosMockados);
      // Já salva os mocks no localStorage
      localStorage.setItem('agendamentos_app', JSON.stringify(dadosMockados));
    }
  }

  // Função para adicionar um novo agendamento
  adicionarAgendamento(novo: agendamentos) {
    const listaAtual = this.agendamentosSubject.getValue();
    const novaLista = [...listaAtual, novo];
    
    // 1. Atualiza a tela em tempo real
    this.agendamentosSubject.next(novaLista);
    
    // 2. Salva no banco do navegador (Sobrevive ao F5)
    localStorage.setItem('agendamentos_app', JSON.stringify(novaLista));
  }

  // Adicione esta função dentro do seu AgendamentoService
deletarAgendamento(agendamentoParaRemover: agendamentos) {
  const listaAtual = this.agendamentosSubject.getValue();
  
  // Filtra a lista mantendo apenas os itens que NÃO são o que queremos deletar
  const novaLista = listaAtual.filter(agend => 
    agend.nome !== agendamentoParaRemover.nome || 
    agend.hora !== agendamentoParaRemover.hora || 
    agend.data !== agendamentoParaRemover.data
  );
  
  this.agendamentosSubject.next(novaLista);
  localStorage.setItem('agendamentos_app', JSON.stringify(novaLista));
}
}