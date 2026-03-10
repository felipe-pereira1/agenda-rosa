import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';

// 1. Importações CORRETAS para projetos Angular
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// 2. Suas configurações originais
const firebaseConfig = {
  apiKey: "AIzaSyAPDqkhPRJBNiXChJxraEXaGtnnl5MFggo",
  authDomain: "agenda-rosa-60b87.firebaseapp.com",
  projectId: "agenda-rosa-60b87",
  storageBucket: "agenda-rosa-60b87.firebasestorage.app",
  messagingSenderId: "164155020867",
  appId: "1:164155020867:web:9a3dee47392419e755a6f6"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
      darkModeSelector: false || 'none' // Força o desligamento do modo escuro automático
    }
      }
    }),
    
    // 3. Fornecendo o Firebase para todo o projeto Angular (Isso substitui o "const app")
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore())
  ]
};