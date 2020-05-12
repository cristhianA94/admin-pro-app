import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { NopagefoundComponent } from '../shared/nopagefound/nopagefound.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { ProfileComponent } from './profile/profile.component';

// Components mantenimientos
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuariosMattableComponent } from './usuarios/usuarios-mattable/usuarios-mattable.component';
// Guards
import { LoginGuard } from '../services/guards/login.guard';
import { UsuarioService } from '../services/usuario/usuario.service';



const pageRoutes: Routes = [
  // Redirige al componente principal de pages
  {
    path: '',
    component: PagesComponent,
    canActivate: [LoginGuard],
    children: [
      // Se utiliza ?data para mandar variables a las rutas
      { path: 'dashboard', component: DashboardComponent, data: { titulo: 'Dashboard' } },
      { path: 'progress', component: ProgressComponent, data: { titulo: 'Progress' } },
      { path: 'graficas1', component: Graficas1Component, data: { titulo: 'Graficas' } },
      { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' } },
      { path: 'rxjs', component: RxjsComponent, data: { titulo: 'Rxjs' } },
      { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes del Tema' } },
      { path: 'profile', component: ProfileComponent, data: { titulo: 'Perfil Usuario' } },
      // Mantenimientos
      {
        path: 'usuarios',
        component: UsuariosComponent,
        data: { titulo: 'Usuarios' },
        resolve: {
          dataUser: UsuarioService
        }
      },
      {
        path: 'usuarios2',
        component: UsuariosMattableComponent,
        data: { titulo: 'Usuarios 2' },
        resolve: {
          dataUser: UsuarioService
        }
      },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ]
  },
  { path: '**', component: NopagefoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(pageRoutes)],
  exports: [RouterModule],
  providers: [UsuarioService]
})
export class PagesRoutingModule { }
