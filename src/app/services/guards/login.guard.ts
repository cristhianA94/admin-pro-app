import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UsuarioService } from './../service.index';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private router: Router, private _usuarioService: UsuarioService) {

  }
  canActivate() {

    if (this._usuarioService.isSignIn()) {
      return true;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: '¡Acceso denegado!'
      })
      this.router.navigate(['/login'])
      return false;
    }
  }

}
