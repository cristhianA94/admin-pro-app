import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Routes
import { PagesRoutingModule } from './pages-routing.module';

// Componentes compartidos
import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import { MaterialModule } from '../material.module';

// Ng2 Charts
import { ChartsModule } from 'ng2-charts';

// Componentes no utilizables
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { IncrementadorComponent } from '../components/incrementador/incrementador.component';

// temporal
import { GraficaDonaComponent } from '../components/grafica-dona/grafica-dona.component';
import { ModalUploadComponent } from '../components/modal-upload/modal-upload.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { HospitalesComponent } from './hospitales/hospitales.component';
import { MedicosComponent } from './medicos/medicos.component';
import { MedicoFormComponent } from './medicos/medico-form/medico-form.component';
import { BusquedaComponent } from './busqueda/busqueda.component';



@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    ProgressComponent,
    Graficas1Component,
    IncrementadorComponent,
    GraficaDonaComponent,
    AccountSettingsComponent,
    PromesasComponent,
    RxjsComponent,
    ProfileComponent,
    UsuariosComponent,
    ModalUploadComponent,
    HospitalesComponent,
    MedicosComponent,
    MedicoFormComponent,
    BusquedaComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Material
    MaterialModule,
    // Charts
    ChartsModule,
    // Componentes compartidos
    SharedModule,
    // Routas de pages
    PagesRoutingModule,
    // Pipes
    PipesModule
  ],
  exports: [
    DashboardComponent,
    ProgressComponent,
    Graficas1Component,
  ],
  providers:[

  ],
  // Permite mostar bien con Web Components
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class PagesModule { }
