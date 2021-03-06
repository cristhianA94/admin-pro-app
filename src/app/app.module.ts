import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Routes
import { AppRoutingModule } from './app-routing.module';

// Modules
import { MaterialModule } from './material.module';
import { ServiceModule } from './services/service.module';
import { SharedModule } from './shared/shared.module';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';

// Temporal
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Alertas
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    // Routes
    AppRoutingModule,
    // Servicios
    ServiceModule,
    // Alertas
    SweetAlert2Module.forRoot(),
    SharedModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent],
  // Permite mostar bien con Web Components
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
