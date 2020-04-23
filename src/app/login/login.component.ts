import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Llama a funcion del plugin assets/js/custom.js
declare function init_Plugins();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {

  constructor(public router:Router) { }

  ngOnInit(): void {
    init_Plugins();
  }

  ingresar(){
    this.router.navigateByUrl("/dashboard");
  }

}
