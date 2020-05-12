import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { URL_API } from '../../config/config';

// Alertas
import Swal from 'sweetalert2'
import { map } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';

import { Usuario } from '../../models/usuario';
import { SubirArchivoService } from '../service.index';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService implements Resolve<any> {

  usuario: Usuario;
  token: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    public _subirArchivoServ: SubirArchivoService
  ) {
    this.cargarStorage();
  }
  // Permite cargar los datos de la api antes de cargar el componente
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

    // Permite array de Observables
    return forkJoin([
      this.cargarUsuariosDesde(),
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
    usuario.password = ":)";
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
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
    // Recarga la pagina login al salir
    // ** Para bugg de re-login
    window.location.reload();
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
        this.guardarStorage(res.id, res.token, res.usuario);
        return true;
      })
    );
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
        this.guardarStorage(res.id, res.token, res.usuario);
        return res.usuario;
      }));
  }

  // Update
  actualizarUsuario(usuario: Usuario) {

    var url: string
    var userPorEditar: Usuario;

    // Edita el profile
    if (usuario._id) {
      url = URL_API + "/usuarios/" + usuario._id + "/actualizar";
      userPorEditar = usuario;

      // Edita el Rol
    } else {
      url = URL_API + "/usuarios/" + this.usuario._id + "/actualizar";
      userPorEditar = usuario;
    }

    url += "?token=" + this.token;

    return this.http.put(url, userPorEditar).pipe(
      map((res: any) => {

        // Guarda en el storage si es el usuario logueado
        if (this.usuario._id === res.usuario._id) {
          var usuarioActualizado: Usuario = res.usuario;
          // Guarda el usuario actualizado en el localStorage
          this.guardarStorage(usuarioActualizado._id, this.token, usuarioActualizado);
        }

        /* Swal.fire(
          '¡Usuario Actualizado!',
          usuario.email,
          'success'
        ); */

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

  // Update imagen profile
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

  // Cargar usuarios
  cargarUsuariosDesde(desde: number = 0) {
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


}
