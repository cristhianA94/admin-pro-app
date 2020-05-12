import { Component, OnInit } from '@angular/core';

import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from '../../models/usuario';

import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
    `
    .img-50{
      width: 50px;
    }
    `
  ]
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  usuarioSeleccionado: Usuario;
  cargando: boolean = true;

  desde: number = 0;
  totalRegistros: number = 0;

  dialogRef: any;

  constructor(
    public _usuarioServ: UsuarioService,
    public _modalUploadService: ModalUploadService
  ) {

  }

  ngOnInit(): void {
    this.cargarUsuarios();
    // Cuando se cambie de imagen recarga los users
    this._modalUploadService.notificacion
      .subscribe(() => this.cargarUsuarios());
  }

  mostrarModal(id: string): void {
    this._modalUploadService.mostrarModal('usuarios', id);
  }

  cargarUsuarios() {

    this.cargando = true;

    this._usuarioServ.cargarUsuariosDesde(this.desde)
      .subscribe((res: any) => {
        this.totalRegistros = res.total;
        this.usuarios = res.usuario;
        this.cargando = false;
      })
  }

  // Permite cuantos usuarios mostrar
  cambiarDesde(valor: number) {
    let desde = this.desde + valor;

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();

  }

  buscarUsuario(termino: string) {

    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }
    this.cargando = true;

    this._usuarioServ.buscarUsuario(termino)
      .subscribe((usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
      })
  }

  guardarUsuario(usuario: Usuario) {

    this.usuarios.forEach((element) => {
      if (element._id === usuario._id) {
        this.usuarioSeleccionado = element;
        this._usuarioServ.actualizarUsuario(this.usuarioSeleccionado)
          .subscribe();
      }
    });
  }

  borrarUsuario(usuario: Usuario) {

    if (usuario._id === this._usuarioServ.usuario._id) {
      Swal.fire(
        '¡Error al borrar usuario!',
        'No se puede borrar a si mismo',
        'error'
      );
      return;
    }

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-outline-success btn-rounded m-2',
        cancelButton: 'btn btn-outline-danger btn-rounded'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Está seguro?',
      text: "Esta a punto de borrar a " + usuario.nombres + usuario.apellidos,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, quiero borrarlo',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then(error => {
      if (error.value) {

        // Delete user
        this._usuarioServ.borrarUsuario(usuario._id)
          .subscribe(() => {
            this.desde = 0;
            this.cargarUsuarios();
          })

        swalWithBootstrapButtons.fire(
          '¡Usuario borrado!',
          'El usuario a sido eliminado',
          'success'
        )

      } else if (
        /* Read more about handling dismissals below */
        error.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          '',
          'error'
        )
      }
    })


  }


}
