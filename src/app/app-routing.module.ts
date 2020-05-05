import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

// Components
import { LoginComponent } from './login/login.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { RegisterComponent } from './login/register.component';


const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // Carga las rutas hijas de modulo principal (Lazy Load)
  {
    path: '',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
  },
  // Preload
  /*  {
     path: 'dashboard',
     loadChildren: './pages/pages.module#PagesModule',
     data: { preload: true }
   }, */

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
