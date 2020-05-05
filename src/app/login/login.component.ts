import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UsuarioService } from '../services/usuario/usuario.service';
import { Usuario } from '../models/usuario';
import { CLIENT_ID } from '../config/config';

// Llama a funcion del plugin assets/js/custom.js
declare function init_Plugins();
// Google SingIn
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  email: string;
  recuerdame: boolean = false;

  auth2: any;

  constructor(
    private fb: FormBuilder,
    public _usuarioService: UsuarioService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    init_Plugins();
    this.googleInit();
    // Retoma el email recordado
    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 1) {
      this.recuerdame = true;
    }
    this.loginFormBuild();

  }

  ngOnDestroy(): void {
    // Resetea los valores del form
    //this.loginForm.reset();
  }

  loginFormBuild(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
      recuerdame: false
    });

  }

  // Buscador para un fácil acceso a los campos de formulario
  get f() {
    return this.loginForm.controls;
  }

  googleInit() {

    gapi.load('auth2', () => {

      this.auth2 = gapi.auth2.init({
        client_id: CLIENT_ID,
        cookie_policy: 'single_host_origin',
        scope: 'profile email'
      });

      this.verificarSignIn(document.getElementById('btnGoogle'));

    });
  }

  verificarSignIn(element) {
    this.auth2.attachClickHandler(element, {}, (googleUser) => {
      // let profile = googleUser.getBasicProfile();
      let token = googleUser.getAuthResponse().id_token;

      this._usuarioService.loginGoogle(token)
        // ** Ruta con javascript por fallas del api de Google SignIn y estilos
        .subscribe(() => window.location.href = "#/dashboard")
    });
  }

  // Sign In
  ingresar() {

    let usuario = new Usuario(
      null,
      this.loginForm.value.email,
      this.loginForm.value.password
    );

    //this.recuerdame = this.loginForm.value.recuerdame;

    this._usuarioService.login(usuario, this.loginForm.value.recuerdame)
      .subscribe(() => this.router.navigateByUrl("/dashboard"));

  }

}
