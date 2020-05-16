import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { URL_API } from '../../config/config';
import { UsuarioService } from '../service.index';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number;

  constructor(
    private http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarMedicos(desde: number): Observable<any> {
    let url = URL_API + "/medicos?desde=" + desde;
    return this.http.get(url).pipe(
      map((res: any) => {
        this.totalMedicos = res.total;
        return res.medico;
      })
    );
  }

  obtenerMedico(id: string): Observable<any> {
    let url = URL_API + "/medicos/" + id;

    return this.http.get(url);

  }

  buscarMedico(termino: string) {
    let url = URL_API + "/busqueda/coleccion/medicos/" + termino;

    return this.http.get(url).pipe(
      map((res: any) => res.medicos)
    );
  }



  borrarMedico(id: string): Observable<any> {
    let url = URL_API + "/medicos/" + id + "/eliminar";
    url += "?token=" + this._usuarioService.token;

    return this.http.delete(url);
  }

}
