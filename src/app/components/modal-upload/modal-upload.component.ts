import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';

import { ModalUploadService } from './modal-upload.service';
import { SubirArchivoService } from '../../services/upload/subir-archivo.service';
import { UsuarioService } from '../../services/usuario/usuario.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styleUrls: ['./modal-upload.component.css']
})
export class ModalUploadComponent implements OnInit {

  imgSubir: File;
  imgTemp: string | ArrayBuffer;

  constructor(
    public _subirFileService: SubirArchivoService,
    public _modalUploadService: ModalUploadService,
    public _usuarioService: UsuarioService,
  ) { }

  ngOnInit(): void {
  }

  subirImg() {
    this._subirFileService.subirArchivo(this.imgSubir, this._modalUploadService.tipo, this._modalUploadService.id)
      .then((res: any) => {
        // Muestra el res del server
        this._modalUploadService.notificacion.emit(res);
        // Si es el usuario logueado, refresca sus datos
        if (this._usuarioService.usuario._id === this._modalUploadService.id) {
          this._usuarioService.guardarStorage(this._usuarioService.usuario._id, this._usuarioService.token, res.usuario, this._usuarioService.menu)
        }
        this.cerrarModal();
      })
      .catch(err => {
        console.log("Error en la carga", err);

      })
  }

  // Resetea los valores de img
  cerrarModal() {
    this.imgSubir = null;
    this.imgTemp = null;
    this._modalUploadService.ocultarModal();
  }

  seleccionImg(archivo: File) {

    // Valida si existe un archivo
    if (!archivo) {
      this.imgSubir = null;
    }

    // Comprueba que sea una imagen
    if (archivo.type.indexOf('image') < 0) {
      Swal.fire(
        '¡Solo imágenes!',
        'El archivo seleecionado no es una imagen',
        'error'
      );
      this.imgSubir = null;
      return;
    }

    this.imgSubir = archivo;

    let reader = new FileReader();
    // Declara imagen temporal
    let urlImagenTemp = reader.readAsDataURL(archivo);
    // Permite visualizar la imagen elegida
    reader.onloadend = () => this.imgTemp = reader.result;

  }


}
