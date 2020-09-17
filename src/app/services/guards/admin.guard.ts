import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    public _usuarioService: UsuarioService,
    public router: Router
  ) {
  }

  canActivate() {
    if (this._usuarioService.usuario.role === 'ADMIN_ROLE') {
      return true;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: '¡Falta de privilegios!'
      });
      this._usuarioService.logOut();
      this.router.navigate(['/login']);
      return false;
    }
  }

}
