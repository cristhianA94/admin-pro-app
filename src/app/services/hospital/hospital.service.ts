import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { URL_API } from '../../config/config';

import { Observable } from 'rxjs';
import { UsuarioService } from '../service.index';
import { map } from 'rxjs/operators';
import { Hospital } from '../../models/hospital';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  totalHospitales: number;

  constructor(
    private http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarHospitales(desde: number = 0): Observable<any> {
    let url = URL_API + "/hospitales?desde=" + desde;
    return this.http.get(url).pipe(
      map((res: any) => {
        this.totalHospitales = res.total;
        return res.hospital;
      })
    );
  }

  obtenerHospital(id: string): Observable<Hospital> {
    let url = URL_API + "/hospitales/" + id;
    return this.http.get(url).pipe(
      map((res:any)=> res.hospital)
    );
  }

  
  buscarHospital(termino: string): Observable<any> {
    let url = URL_API + "/busqueda/coleccion/hospitales/" + termino;

    return this.http.get(url).pipe(
      map((res: any) => res.hospitales)
    );
  }

  crearHospital(hospital: Hospital) {
    let url = URL_API + "/hospitales/crear";
    url += "?token=" + this._usuarioService.token;

    return this.http.post(url, hospital).pipe(
      map((res: any) => {

        // Notificacion
        Swal.fire(
          'Hospital Creado!',
          hospital.nombre,
          'success'
        );
        return true;
      })
    );
  }

  actualizarHospital(hospital: Hospital) {
    let url = URL_API + "/hospitales/" + hospital._id + "/actualizar";
    url += "?token=" + this._usuarioService.token;

    return this.http.put(url, hospital).pipe(
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


  borrarHospital(id: string): Observable<any> {
    let url = URL_API + "/hospitales/" + id + "/eliminar";
    url += "?token=" + this._usuarioService.token;

    return this.http.delete(url);
  }

}
