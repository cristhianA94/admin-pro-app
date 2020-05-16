import { Component, OnInit } from '@angular/core';

import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario';

// Llama a funcion del plugin assets/js/custom.js
declare function init_Plugins();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {
  usuario: Usuario;


  constructor(public _usuarioService: UsuarioService) { }

  ngOnInit(): void {
    init_Plugins();
    this.usuario = this._usuarioService.usuario;
  }

}
