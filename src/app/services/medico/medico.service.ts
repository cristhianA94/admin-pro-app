import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { URL_API } from '../../config/config';
import { UsuarioService } from '../service.index';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Medico } from '../../models/medico';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number;

  constructor(
    private http: HttpClient,
    public _usuarioService: UsuarioService,
    public router: Router
  ) { }

  /* resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    // Obtiene el id del parametro de la ruta
    let id = route.paramMap.get('id');
    if (id === 'nuevo') {
      return;
    } else {
      return this.obtenerMedico(id);
    }
  } */

  cargarMedicos(desde: number = 0): Observable<Medico[]> {
    let url = URL_API + "/medicos?desde=" + desde;
    return this.http.get(url).pipe(
      map((res: any) => {
        this.totalMedicos = res.total;
        return res.medico;
      })
    );
  }

  obtenerMedico(id: string): Observable<Medico> {
    let url = URL_API + "/medicos/" + id;

    return this.http.get(url).pipe(
      map((res: any) => res.medico)
    );
  }

  buscarMedico(termino: string): Observable<any> {
    let url = URL_API + "/busqueda/coleccion/medicos/" + termino;

    return this.http.get(url).pipe(
      map((res: any) => res.medicos)
    );
  }

  guardarMedico(medico: Medico): Observable<any> {
    let url = URL_API + "/medicos/crear";
    url += "?token=" + this._usuarioService.token;

    return this.http.post(url, medico).pipe(
      map((res: any) => {

        Swal.fire(
          'Médico creado!',
          medico.nombres + " " + medico.apellidos,
          'success'
        );
        return res.medico;
      })
    )
  }

  actualizarMedico(medico: Medico) {
    let url = URL_API + "/medicos/" + medico._id + "/actualizar";
    url += "?token=" + this._usuarioService.token;

    return this.http.put(url, medico).pipe(
      map((res: any) => {

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
              //window.location.reload();
            }, 1000)
          },
          onClose: () => {
            clearInterval(timerInterval)
          }
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
          }
        });

        return true;
      })
    );
  }

  borrarMedico(id: string): Observable<any> {
    let url = URL_API + "/medicos/" + id + "/eliminar";
    url += "?token=" + this._usuarioService.token;

    return this.http.delete(url);
  }

}
