import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from '../../models/usuario';

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
  imgTemp: string | ArrayBuffer;

  constructor(
    public fb: FormBuilder,
    public uploadService: SubirArchivoService,
    public _usuarioService: UsuarioService,
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

    if (!this.usuario.google) {
      this.updateUsuarioForm = this.fb.group({
        nombres: [this.usuario.nombres, Validators.required],
        apellidos: [this.usuario.apellidos],
        email: [this.usuario.email, [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
      // Si es usuario de Google se prohibe cambiar email y pass
    } else if (this.usuario.google) {

      this.updateUsuarioForm = this.fb.group({
        nombres: [this.usuario.nombres, Validators.required],
        apellidos: [this.usuario.apellidos],
        email: [this.usuario.email],
        password: [this.usuario.email]
      });

      this.updateUsuarioForm.controls.email.disable();
      this.updateUsuarioForm.controls.password.disable();

    }
  }

  // Editar user
  guardarCambios() {

    if (!this.usuario.google) {

      this.usuario = {
        nombres: this.updateUsuarioForm.value.nombres,
        apellidos: this.updateUsuarioForm.value.apellidos,
        email: this.updateUsuarioForm.value.email,
        password: this.updateUsuarioForm.value.password
      }

      this._usuarioService.actualizarUsuario(this.usuario)
        .subscribe();

    } else if (this.usuario.google) {

      this.usuario = {
        nombres: this.updateUsuarioForm.value.nombres,
        apellidos: this.updateUsuarioForm.value.apellidos,
        email: this.usuario.email,
        password: this.usuario.password
      };

      this._usuarioService.actualizarUsuario(this.usuario)
        .subscribe();
    }
  }

  cancelarForm() {
    this.updateUserFormBuild();
  }

  // Genera preview imagen
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

  cambiarImg() {
    this._usuarioService.cambiarImagen(this.imgSubir, this.usuario._id);
  }



}
