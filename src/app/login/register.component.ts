import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';

declare function init_Plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public _usuarioService: UsuarioService,
    public router: Router
  ) { }

  VerificarPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  ngOnInit(): void {
    init_Plugins();
    this.registerFormBuild();

  }

  ngOnDestroy(): void {
    // Resetea los valores del form
    //this.registerForm.reset();
  }

  registerFormBuild(): void {
    this.registerForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: [''],
      email: ['', Validators.email],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      condiciones: [false, Validators.requiredTrue],
    }, {
      validator: this.VerificarPassword('password', 'confirmPassword')
    });

    /* this.registerForm.setValue({
      nombres: 'Test',
      apellidos: 'Test ',
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456',
      condiciones: true
    }); */

  }

  // Buscador para un fácil acceso a los campos de formulario
  get f() {
    return this.registerForm.controls;
  }

  registrarUsuario() {

    let usuario = new Usuario(
      this.registerForm.value.nombres,
      this.registerForm.value.email,
      this.registerForm.value.password,
      this.registerForm.value.apellidos
    );

    this._usuarioService.crearUsuario(usuario)
      .subscribe(() => this.router.navigate(['/dashboard']));
  }
}




