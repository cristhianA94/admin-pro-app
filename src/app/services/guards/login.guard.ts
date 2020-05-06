import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UsuarioService } from './../service.index';

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
      console.log("Access Denied!")
      this.router.navigate(['/login'])
      return false;
    }
  }

}
