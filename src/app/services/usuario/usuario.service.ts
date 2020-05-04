import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { Usuario } from '../../models/usuario';
import { URL_API } from '../../config/config';
// Alertas
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  usuario: Usuario;
  token: string;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.cargarStorage();
  }

  login(usuario: Usuario, recuerdame: boolean) {
    // Guarda el email si el esta el check "recuerdame"
    if (recuerdame) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    let url = URL_API + "/login";
    return this.http.post(url, usuario).pipe(
      map((res: any) => {
        this.guardarStorage(res.id, res.token, res.usuario)
        return true;
      })
    );
  }

  loginGoogle(token: string) {
    let url = URL_API + "/login/google";

    return this.http.post(url, { token }).pipe(
      map((res: any) => {
        this.guardarStorage(res.id, res.token, res.usuario)
        return true;
      })
    );
  }

  // Verificar si esta se encuentra el token activo del user
  isSignIn() {
    return (this.token.length > 10) ? true : false;
  }

  // Permite guardar en el storage los datos del user
  guardarStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    // Convierte a un objeto JSON
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.token = token;
    this.usuario = usuario;
  }

  // Verifica el localStorage sino lo resetea
  cargarStorage() {

    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.token = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  // Register
  crearUsuario(usuario: Usuario) {
    let url = URL_API + "/usuarios/crear";

    return this.http.post(url, usuario).pipe
      (map(res => {
        // Notificacion
        Swal.fire(
          '¡Usuario creado!',
          usuario.email,
          'success'
        )
        return res["usuario"]
      }));
  }

  logOut() {
    this.usuario = null;
    this.token = '';

    // Borra las variables del localstorage
    //localStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('id');
    this.router.navigate(['/login']);
  }



}
