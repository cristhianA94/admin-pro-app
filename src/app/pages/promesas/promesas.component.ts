import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {


  constructor() {

    this.contarTres().then(
      msj => console.log("Termino", msj)
    )
      .catch(error => console.log('Error', error)
      )


  }

  ngOnInit(): void {

  }

  contarTres(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let count = 0;

      let intervalo = setInterval(() => {
        count += 1;
        console.log(count);

        if (count === 3) {
          resolve(true);
          //reject('Esta ocurriendo un error');
          clearInterval(intervalo);
        }
      }, 1000);

    });
  }

}
