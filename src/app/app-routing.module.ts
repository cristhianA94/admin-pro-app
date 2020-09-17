import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { LoginComponent } from './login/login.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { RegisterComponent } from './login/register.component';
import { PagesComponent } from './pages/pages.component';
import { LoginGuard } from './services/guards/login.guard';


const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // TODO (Lazy Load) Carga las rutas hijas de modulo principal
  {
    path: '',
    component: PagesComponent,
    canActivate: [LoginGuard],
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NopagefoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        useHash: true, // sirve para hosting
        //preloadingStrategy: PreloadAllModules,
        //enableTracing: true // Solo para debugg
      }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
