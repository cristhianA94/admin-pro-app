import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_API } from '../../config/config';
import { Usuario } from '../../models/usuario';
import { Medico } from '../../models/medico';
import { Hospital } from '../../models/hospital';


@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
    `
    .img-50{
      width: 100px;
      height: 100px;
    }
    `
  ]
})
export class BusquedaComponent implements OnInit {

  usuarios: Usuario[] = [];
  medicos: Medico[] = [];
  hospitales: Hospital[] = [];

  constructor(
    public actRoute: ActivatedRoute,
    public http: HttpClient
  ) { }

  ngOnInit(): void {
    this.actRoute.params.subscribe((params) => {
      let termino = params.termino;
      this.buscar(termino);
    });
  }


  buscar(termino: string) {
    let url = URL_API + '/busqueda/todo/' + termino;
    this.http.get(url).subscribe((res:any) => {
      this.usuarios = res.usuarios;
      this.hospitales = res.hospitales;
      this.medicos = res.medicos;
    });
  }


}
