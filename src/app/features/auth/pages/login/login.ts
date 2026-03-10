import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Importações do Firebase Firestore
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  mensagemErro: string = '';
  loading: boolean = false;

  // NOVO: Injeção do Firestore do jeito recomendado pelo Angular 17+
  private firestore = inject(Firestore);

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (localStorage.getItem('usuarioLogado')) {
      this.router.navigate(['/home']);
    }
  }

  async onSubmit() {
    console.log("Botão de login clicado!"); // Para você ver se entrou na função
    
    if (this.loginForm.valid) {
      this.loading = true;
      const { usuario, senha } = this.loginForm.value;

      console.log(`Buscando no banco o usuário: ${usuario}`);

      try {
        const usuariosRef = collection(this.firestore, 'usuarios');
        
        // Verifica se o nome e a senha existem
        const q = query(usuariosRef, 
          where('nome', '==', usuario.toLowerCase()), 
          where('senha', '==', senha)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const usuarioEncontrado = querySnapshot.docs[0];
          const dadosUsuario = usuarioEncontrado.data();
          
          console.log("Usuário logado com sucesso:", dadosUsuario);

          // Salva os dados no localStorage
          localStorage.setItem('usuarioLogado', JSON.stringify({
            id: usuarioEncontrado.id, 
            nome: dadosUsuario['nome'],
            nomeCompleto: dadosUsuario['nomeCompleto'] || dadosUsuario['nome']
          }));

          this.mensagemErro = '';
          this.router.navigate(['/home']);
          
        } else {
          console.log("Nenhum usuário encontrado com essa senha.");
          this.mensagemErro = 'Usuário ou senha incorretos.';
        }
      } catch (error) {
        console.error("Erro CRÍTICO ao buscar no banco: ", error);
        this.mensagemErro = 'Erro de conexão com o banco de dados.';
      } finally {
        this.loading = false;
      }
    } else {
      console.log("O formulário não está válido. Faltou digitar algo.");
      this.loginForm.markAllAsTouched();
    }
  }
}