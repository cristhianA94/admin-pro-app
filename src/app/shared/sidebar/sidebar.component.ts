import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/shared/sidebar.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  usuario: Usuario;
  
  constructor(
    public _sidebar: SidebarService,
    public _usuarioService: UsuarioService,
  ) { }

  ngOnInit(): void {
    this.usuario = this._usuarioService.usuario;
    // Permite guardar los datos del user al cargar la pagina
    //this.usuario = JSON.parse(localStorage.getItem('usuario'));

  }

}
