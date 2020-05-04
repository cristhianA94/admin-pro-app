import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

// Components
import { LoginComponent } from './login/login.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { RegisterComponent } from './login/register.component';


const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // Redirige al cargar la app
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // Carga las rutas hijas de modulo principal

  // Lazy Load
  //{ path:'', loadChildren:  './pages/pages.module#PagesModule'},
  { path: '', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
  // Preload
  //{path:'', loadChildren:  './pages/pages.module#PagesModule', data: {preload:true}},
  
  // Cualquier ruta diferente a las declaradas
  { path: '**', component: NopagefoundComponent }
];

@NgModule({
  /// true, preloadingStrategy: PreloadAllModules
  imports: [RouterModule.forRoot(routes, { useHash: true} )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
