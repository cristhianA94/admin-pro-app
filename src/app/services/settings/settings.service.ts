import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  ajustes: Ajustes = {
    temaUrl: 'assets/css/colors/default-dark.css',
    tema: 'default'
  };

  constructor(
    // Permite el acceso a todo el DOM
    @Inject(DOCUMENT) private _document) {
    this.cargarAjustes();
  }

  guardarAjustes() {
    //console.log("Guardando en el localStorage");
    // Convierte el objeto en JSON y lo guarda en el localstorage
    localStorage.setItem('ajustes', JSON.stringify(this.ajustes));
  }

  cargarAjustes() {
    // Consulta si existen ajustes guardados
    if (localStorage.getItem('ajustes')) {
      // Convierte el JSON en objeto
      this.ajustes = JSON.parse(localStorage.getItem('ajustes'));
      //console.log("Cargando del localStorage");

      this.aplicarTema(this.ajustes.tema);
    }
    else {
      //console.log("Tema por defecto");
      this.aplicarTema(this.ajustes.tema);
    }
  }

  aplicarTema(tema: string) {

    let url = `assets/css/colors/${tema}.css`;
    // Accede al atributo del elemento seleccionado
    this._document.getElementById('tema').setAttribute('href', url);
    //console.log(link);

    this.ajustes.tema = tema;
    this.ajustes.temaUrl = tema;
    this.guardarAjustes();
  }

}

interface Ajustes {
  temaUrl: string;
  tema: string;
}
