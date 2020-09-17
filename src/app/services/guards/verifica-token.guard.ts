import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate {

  constructor(
    public _usuarioService: UsuarioService,
    public router:Router
    ) {

  }
  canActivate(): Promise<boolean> | boolean {

    let token = this._usuarioService.token;
    // atob: decodifica un string en base 64
    // Extrae la informacion del token
    let payload = JSON.parse(atob(token.split('.')[1]));

    let expirado = this.expirado(payload.exp);
    // Si expiro impide el acceso
    if (expirado) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.verificaRenueva(payload.exp);
  }


  verificaRenueva(fechaExp: number): Promise<boolean> {
    return new Promise((resolve, reject) => {

      let tokenExp = new Date(fechaExp * 1000);
      let ahora = new Date();

      // Suma a la hora actual 4 horas
      ahora.setTime(ahora.getTime() + (4 * 60 * 60 * 1000));

      // Si la fecha del token esta dentro del tiempo no hace nada
      if (tokenExp.getTime() > ahora.getTime()) {
        resolve(true);
        // Si el token esta a punto de expirar se renueva
      } else {
        this._usuarioService.renovarToken().subscribe((res) => {
          resolve(true)
        }, () => {
          // saca al usuario
          this.router.navigate(['/login']);
          reject(false);
        });
      }

      resolve(true);
    });
  }

  // Comprueba si expiro el tokenvv
  expirado(fechaExp: number) {
    // Hora actual en milisegundos
    let horaActual = new Date().getTime() / 1000;

    if (fechaExp < horaActual) {
      return true;
    } else {
      return false;
    }
  }

}
