import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit {

  // Variables que pueden venir de otros componentes
  // Para numeros utilizar en el componente de fuera []: [progreso]
  @Input() progreso: number = 50;
  // Para strings utilizar en el componente de fuera sin []: leyenda
  // Se puede poner otro nombre a la variable para el componente de fuera
  @Input('nombre') leyenda: string = 'Leyenda';

  // Emite un valor externo al componente
  @Output('actualizarValor') cambioValor: EventEmitter<number> = new EventEmitter();

  // 
  @ViewChild('txtProgress') txtProgress: ElementRef;

  constructor() {
  }

  ngOnInit(): void {
  }

  // Cambiar valor segun botones + y -
  cambiarValor(valor: number) {

    if (this.progreso >= 100 && valor > 0) {
      this.progreso = 100;
      return;
    }
    if (this.progreso <= 0 && valor < 0) {
      this.progreso = 0;
      return;
    }
    this.progreso += valor;
    // Enfoca el foco al input despues de pulsar
    this.txtProgress.nativeElement.focus();
    // Emite el valor
    this.cambioValor.emit(this.progreso);
  }

  // Cambia el valor segun el input
  onChange(newValue: number) {

    // Seleeciona un elemento html con su nombre
    //let elementHTML: any = document.getElementsByName('progreso'[0]);
    //console.log(elementHTML.value);

    if (newValue >= 100) {
      this.progreso = 100;
    } else if (newValue <= 0) {
      this.progreso = 0;
    } else {
      this.progreso = newValue;
    }

    //elementHTML.value = this.progreso;
    this.txtProgress.nativeElement.value = this.progreso;
    this.cambioValor.emit(this.progreso);
  }

}
