import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Routes
import { PagesRoutingModule } from './pages-routing.module';

// Componentes compartidos
import { SharedModule } from '../shared/shared.module';

// Componentes
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';

import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
import { GraficaDonaComponent } from '../components/grafica-dona/grafica-dona.component';

// Ng2 Charts
import { ChartsModule } from 'ng2-charts';

// Material
import { MaterialModule } from '../material/material.module';
import { RxjsComponent } from './rxjs/rxjs.component';

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
  ],
  imports: [
    CommonModule,
    FormsModule,
    // Material
    MaterialModule,
    // Componentes compartidos
    SharedModule,
    // Routas de pages
    PagesRoutingModule,
    // Charts
    ChartsModule
  ],
  exports: [
    DashboardComponent,
    ProgressComponent,
    Graficas1Component,
  ]
})
export class PagesModule { }
