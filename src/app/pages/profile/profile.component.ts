import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from '../../models/usuario';

import { MatDialog } from '@angular/material/dialog';
import { SubirArchivoService } from '../../services/upload/subir-archivo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  updateUsuarioForm: FormGroup;
  usuario: Usuario;

  imgSubir: File;
  imgTemp: string | ArrayBuffer

  constructor(
    public fb: FormBuilder,
    public uploadService: SubirArchivoService,
    public _usuarioService: UsuarioService,
    public dialog: MatDialog,
  ) {
    this.usuario = this._usuarioService.usuario;

  }

  ngOnInit(): void {
    this.updateUserFormBuild();
  }

  // Buscador para un fácil acceso a los campos de formulario
  get f() {
    return this.updateUsuarioForm.controls;
  }

  updateUserFormBuild() {
    this.updateUsuarioForm = this.fb.group({
      nombres: [this.usuario.nombres, Validators.required],
      apellidos: [this.usuario.apellidos],
      email: [this.usuario.email, Validators.required],
      password: ['', [Validators.required, Validators.min(6)]]
    });
  }

  // Editar user
  guardarCambios() {
    this._usuarioService.updateUsuario(this.updateUsuarioForm.value)
      .subscribe();
  }

  // Valida si existe un archivo
  seleccionImg(archivo: File) {

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

  cambiarImg() {
    this._usuarioService.cambiarImagen(this.imgSubir, this.usuario._id);
  }



}
