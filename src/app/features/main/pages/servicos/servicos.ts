import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FooterComponent } from '../../../../shared/components/footer/footer';
import { HeaderComponent } from '../../../../shared/components/header/header';
import { ServicosModalComponent } from '../../components/servicos-modal/servicos-modal';
import { NovoServico, Servico } from '../../models/servico.model';
import { ServicosService } from '../../services/servicos.service';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [CurrencyPipe, FooterComponent, HeaderComponent, ServicosModalComponent],
  templateUrl: './servicos.html',
  styleUrl: './servicos.css'
})
export class ServicosComponent implements OnInit {
  private readonly servicosService = inject(ServicosService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  modalServicoVisivel = false;
  salvandoServico = false;
  carregandoServicos = true;
  mensagemErro = '';
  servicos: Servico[] = [];
  private idUsuarioLogado = '';

  ngOnInit(): void {
    const usuarioSalvo = localStorage.getItem('usuarioLogado');

    if (!usuarioSalvo) {
      void this.router.navigate(['/login']);
      return;
    }

    try {
      const usuario = JSON.parse(usuarioSalvo) as { id?: unknown };

      if (typeof usuario.id !== 'string' || !usuario.id) {
        throw new Error('Usuário salvo sem identificador.');
      }

      this.idUsuarioLogado = usuario.id;
      void this.carregarServicos();
    } catch (error) {
      console.error('Erro ao identificar usuário logado:', error);
      localStorage.removeItem('usuarioLogado');
      void this.router.navigate(['/login']);
    }
  }

  abrirModalServico(): void {
    this.mensagemErro = '';
    this.modalServicoVisivel = true;
  }

  async salvarServico(servico: NovoServico): Promise<void> {
    if (!this.idUsuarioLogado || this.salvandoServico) {
      return;
    }

    this.salvandoServico = true;
    this.mensagemErro = '';

    try {
      const servicoSalvo = await this.servicosService.cadastrar(
        this.idUsuarioLogado,
        servico
      );

      this.servicos = [...this.servicos, servicoSalvo].sort((a, b) =>
        a.nome.localeCompare(b.nome, 'pt-BR')
      );
      this.modalServicoVisivel = false;
    } catch (error) {
      console.error('Erro ao cadastrar serviço:', error);
      this.mensagemErro = 'Não foi possível salvar o serviço. Tente novamente.';
    } finally {
      this.salvandoServico = false;
      this.cdr.detectChanges();
    }
  }

  private async carregarServicos(): Promise<void> {
    this.carregandoServicos = true;
    this.mensagemErro = '';

    try {
      this.servicos = await this.servicosService.listarAtivos(this.idUsuarioLogado);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      this.mensagemErro = 'Não foi possível carregar os serviços cadastrados.';
    } finally {
      this.carregandoServicos = false;
      this.cdr.detectChanges();
    }
  }
}
