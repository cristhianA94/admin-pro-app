import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { URL_API } from '../../config/config';

// Alertas
import Swal from 'sweetalert2'
import { map } from 'rxjs/operators';

import { Usuario } from '../../models/usuario';
import { SubirArchivoService } from '../service.index';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    public _subirArchivoServ: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  // Verificar si esta se encuentra el token activo del user
  isSignIn() {
    return (this.token.length > 5) ? true : false;
  }

  // Verifica el localStorage sino lo resetea
  cargarStorage() {

    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  // Permite guardar en el storage los datos del user
  guardarStorage(id: string, token: string, usuario: Usuario) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    // Convierte a un objeto JSON
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
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

  // Register
  crearUsuario(usuario: Usuario) {
    let url = URL_API + "/usuarios/crear";

    return this.http.post(url, usuario).pipe
      (map((res: any) => {
        // Notificacion
        Swal.fire(
          '¡Usuario Creado!',
          usuario.email,
          'success'
        );
        this.guardarStorage(res.id, res.token, res.usuario)

        return res.usuario;
      }));
  }

  // Update
  updateUsuario(usuario: Usuario) {

    let url = URL_API + "/usuarios/" + this.usuario._id + "/actualizar";
    url += "?token=" + this.token;

    return this.http.put(url, usuario).pipe(
      map((res: any) => {

        let usuarioActualizado: Usuario = res.usuario;

        // Guarda el usuario actualizado en el localStorage
        this.guardarStorage(usuarioActualizado._id, this.token, usuarioActualizado);
        Swal.fire(
          '¡Usuario Actualizado!',
          usuario.email,
          'success'
        );

        return true;
      })
    );

  }

  cambiarImagen(file: File, id: string) {

    this._subirArchivoServ.subirArchivo(file, "usuarios", id)
      .then((res: any) => {

        this.usuario.img = res.usuario.img;
        Swal.fire(
          '¡Imagen Actualizada!',
          this.usuario.nombres + " " + this.usuario.apellidos,
          'success'
        );
        this.guardarStorage(id, this.token, this.usuario);
      })

      .catch(err => {
        console.log(err);
      })

  }



}
