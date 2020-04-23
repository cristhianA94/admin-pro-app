import { Component, OnInit } from '@angular/core';

// Llama a funcion del plugin assets/js/custom.js
declare function init_Plugins();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    init_Plugins();
  }

}
