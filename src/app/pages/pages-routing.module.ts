import { NgModule } from '@angular/core';
import { Routes, RouterModule, Resolve } from '@angular/router';

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
import { BusquedaComponent } from './busqueda/busqueda.component';

// Components mantenimientos
import { UsuariosComponent } from './usuarios/usuarios.component';
import { HospitalesComponent } from './hospitales/hospitales.component';
import { MedicosComponent } from './medicos/medicos.component';
import { MedicoFormComponent } from './medicos/medico-form/medico-form.component';


// Guards
import { AdminGuard, LoginGuard } from '../services/service.index';
//Services
import { UsuarioService } from '../services/usuario/usuario.service';
import { MedicoService } from '../services/medico/medico.service';
import { HospitalService } from '../services/hospital/hospital.service';



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
      { path: 'busqueda/:termino', component: BusquedaComponent, data: { titulo: 'Buscador' } },
      // Mantenimientos
      {
        path: 'usuarios',
        component: UsuariosComponent,
        data: { titulo: 'Mantenimiento de Usuarios' },
        canActivate: [AdminGuard]
      },
      { path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Mantenimiento de Hospitales' } },
      { path: 'medicos', component: MedicosComponent, data: { titulo: 'Mantenimiento de Médicos' } },
      { path: 'medico/:id', component: MedicoFormComponent, data: { titulo: 'Actualizar Médico' } },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ]
  },
  { path: '**', component: NopagefoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(pageRoutes)],
  exports: [RouterModule],
  providers: [
    UsuarioService,
    MedicoService,
    HospitalService
  ]
})
export class PagesRoutingModule { }
