import { Component, OnInit } from '@angular/core';

declare function init_Plugins();

@Component({
  selector: 'app-nopagefound',
  templateUrl: './nopagefound.component.html',
  styles: [
  ]
})
export class NopagefoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    init_Plugins();
  }

}
