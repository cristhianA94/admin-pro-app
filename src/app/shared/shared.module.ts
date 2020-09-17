import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

// Componentes compartidos
import { PipesModule } from '../pipes/pipes.module';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumsComponent } from './breadcrums/breadcrums.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { ModalUploadComponent } from '../components/modal-upload/modal-upload.component';


@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    BreadcrumsComponent,
    NopagefoundComponent,
    ModalUploadComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PipesModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    BreadcrumsComponent,
    NopagefoundComponent,
    ModalUploadComponent
  ]
})
export class SharedModule { }
