import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { URL_API } from '../../config/config';
import { Usuario } from '../../models/usuario';
import { SubirArchivoService } from '../service.index';

// Alertas
import Swal from 'sweetalert2'

import { Observable, forkJoin, throwError } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class UsuarioService implements Resolve<any> {

  usuario: Usuario;
  token: string;
  role: string;
  menu: any[] = [];

  public desde: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    public _subirArchivoServ: SubirArchivoService
  ) {
    this.cargarStorage();
  }
  // Permite cargar los datos de la api antes de cargar el componente
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

    // TODO Permite resolver los datos de Observables
    return forkJoin([
      this.cargarUsuariosDesde(this.desde),
      this.cargarUsuariosMatTable()
    ]).pipe(
      map(result => {
        return {
          //Retorna varios Observables
          usersDesde: result[0],
          allUsers: result[1]
        };
      })
    )
  }

  // Verificar si esta se encuentra el token activo del user
  isSignIn() {
    return (this.token.length > 5) ? true : false;
  }

  // Verifica el localStorage sino lo resetea
  cargarStorage() {

    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.role = localStorage.getItem('role');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.role = '';
      this.menu = [];
    }
  }

  // Permite guardar en el storage los datos del user
  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('role', usuario.role);
    // Convierte a un objeto JSON
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.role = usuario.role;
    this.token = token;
    this.menu = menu;
  }

  logOut() {
    this.usuario = null;
    this.token = '';
    this.role = '';

    // Borra las variables del localstorage
    //localStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('usuario');
    localStorage.removeItem('id');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
    // Recarga la pagina login al salir
    // TODO Para bugg de re-login
    window.location.reload();
  }

  loginGoogle(token: string) {

    let url = URL_API + "/login/google";

    return this.http.post(url, { token }).pipe(
      map((res: any) => {
        this.guardarStorage(res.id, res.token, res.usuario, res.menu)
        return true;
      })
    );
  }

  login(usuario: Usuario, recuerdame: boolean = false) {
    // Guarda el email si el esta el check "recuerdame"
    if (recuerdame) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    let url = URL_API + "/login";
    return this.http.post(url, usuario).pipe(
      map((res: any) => {
        this.guardarStorage(res.id, res.token, res.usuario, res.menu);
        return true;
      }),
      // Realiza la peticion 2 veces al menos antes de lanzar el error
      retry(1),
      catchError(this.handleErrorLogin)
      )
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
        this.guardarStorage(res.id, res.token, res.usuario, this.menu);
        return res.usuario;
        }),
      catchError(this.handleErrorRegister)
      );
  }

  // Update profile
  actualizarUsuario(usuario: Usuario) {

    var url = URL_API + "/usuarios/" + this.usuario._id + "/actualizar";
    url += "?token=" + this.token;

    return this.http.put(url, usuario).pipe(
      map((res: any) => {

        var usuarioActualizado: Usuario = res.usuario;
        // Guarda el usuario actualizado en el localStorage
        this.guardarStorage(usuarioActualizado._id, this.token, usuarioActualizado, this.menu);

        // Notificacion
        let timerInterval
        Swal.fire({
          title: '¡Usuario Actualizado!',
          icon: 'success',
          timer: 1000,
          timerProgressBar: true,
          onBeforeOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
              Swal.getContent()
              // Recargar la pagina
              window.location.reload();
            }, 1000)
          },
          onClose: () => {
            clearInterval(timerInterval)
          }
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
          }
        })

        return true;
      })
    );

  }

  // Update role
  actualizarRol(usuario: Usuario) {

    var url = URL_API + "/usuarios/" + usuario._id + "/actualizarRol";
    url += "?token=" + this.token;

    return this.http.put(url, { role: usuario.role }).pipe(
      map((res: any) => {

        if (this.usuario._id === usuario._id) {
          this.guardarStorage(res.usuario._id, this.token, res.usuario, this.menu)
        }

        // Notificacion
        let timerInterval
        Swal.fire({
          title: 'Rol Actualizado!',
          icon: 'success',
          timer: 1000,
          timerProgressBar: true,
          onBeforeOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
              Swal.getContent()
            }, 1000)
          },
          onClose: () => {
            clearInterval(timerInterval)
          }
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
          }
        })

        return true;
      })
    );

  }

  // Update imagen profile
  cambiarImagen(file: File, id: string) {

    this._subirArchivoServ.subirArchivo(file, "usuarios", id)
      .then((res: any) => {
        Swal.fire(
          '¡Imagen Actualizada!',
          this.usuario.nombres + " " + this.usuario.apellidos,
          'success'
        );

        this.guardarStorage(id, this.token, res.usuario, this.menu);
      })
      .catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Error al subir la imagen',
          text: err
        })
      })

  }

  // Obtiene un usuario
  obtenerUsuario(id: string) {
    let url = URL_API + "/usuarios/" + id;
    return this.http.get(url).pipe(
      map((user: any) => {
        return user.usuario;
      })
    );

  }
  // Cargar usuarios
  cargarUsuariosDesde(desde: number) {
    let url = URL_API + "/usuarios?desde=" + desde;
    return this.http.get(url);
  }

  cargarUsuariosMatTable() {
    // Cambiar en backend usuarioRoute => limit
    let url = URL_API + "/usuarios";
    return this.http.get(url);
  }

  // Search users
  buscarUsuario(termino: string) {
    let url = URL_API + "/busqueda/coleccion/usuarios/" + termino;

    return this.http.get(url).pipe(
      map((res: any) => res.usuarios)
    )
  }

  borrarUsuario(id: string) {
    let url = URL_API + "/usuarios/" + id + "/eliminar";
    url += "?token=" + this.token;

    return this.http.delete(url);
  }

  /* Handle API errors */
  handleErrorLogin(error: HttpErrorResponse) {

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error['msg']);
    } else {
      Swal.fire(
        '¡Error con sus credenciales!',
        error.error['msg'],
        'error');
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend code ${error.status}` );
    }
    // return an observable with a user-facing error message
    return throwError(
      'Algo malo sucedió; por favor, inténtelo de nuevo más tarde..');
  };

  handleErrorRegister(error: HttpErrorResponse) {

    console.log(error.error.error['message']);

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      Swal.fire(
        '¡Error al crear usuario!',
        error.error.error['message'],
        'error');
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend code ${error.status}` );
    }
    // return an observable with a user-facing error message
    return throwError(
      'Algo malo sucedió; por favor, inténtelo de nuevo más tarde..');
  };


}
