import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: [
  ]
})
export class AccountSettingsComponent implements OnInit {

  constructor(public _ajustes: SettingsService) { }

  ngOnInit(): void {
    // Coloca el chek del tema al recargar la pagina
    this.colocarCheck();
  }

  cambiarColor(tema: string, link: any) {
    // Envia la referencia del elemetno html
    this.aplicarCheck(link);

    this._ajustes.aplicarTema(tema);
  }

  aplicarCheck(link: any) {
    // Arreglo de selector check
    let selectors: any = document.getElementsByClassName('selector');

    for (const ref of selectors) {
      // Borra toda clase que ponga working
      ref.classList.remove('working');
    }
    // Agrega en atributo class el working al link seleccionado
    link.classList.add('working');
  }

  colocarCheck() {
    let selectors: any = document.getElementsByClassName('selector');
    let tema = this._ajustes.ajustes.tema;

    for (const ref of selectors) {
      // Compara el nombre del tema en los atributos de la clase y le pone el working
      if (ref.getAttribute('data-theme') === tema) {
        ref.classList.add('working');
        break;
      }
    }
  }

}
