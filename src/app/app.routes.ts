import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login';
import { HomeComponent } from './features/home/pages/home/home';
import { AgendarComponent } from './features/main/pages/agendar/agendar';
import { CalendarComponent } from './features/main/pages/calendar/calendar';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'calendar', component: CalendarComponent},
  { path: 'agendamentos/:data', component: AgendarComponent}

];
