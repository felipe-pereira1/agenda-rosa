import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-servicos-modal',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule],
  templateUrl: './servicos-modal.html',
  styleUrl: './servicos-modal.css'
})
export class ServicosModalComponent {
  private readonly formBuilder = inject(FormBuilder);

  @Input() visible = false;
  @Output() readonly visibleChange = new EventEmitter<boolean>();

  readonly servicoForm = this.formBuilder.nonNullable.group({
    nome: [''],
    valor: [''],
    duracao: ['']
  });

  fechar(): void {
    this.limparCampos();
    this.visibleChange.emit(false);
  }

  aoAlterarVisibilidade(visible: boolean): void {
    if (!visible) {
      this.limparCampos();
    }

    this.visibleChange.emit(visible);
  }

  private limparCampos(): void {
    this.servicoForm.reset();
  }
}
