import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnInit, OnDestroy {

  // objeto para setear un Observable
  subscripcion: Subscription;

  constructor() {
  }

  ngOnInit(): void {
    this.subscripcion = this.regresaObervable()
      .subscribe(
        // 3 estados de los Obervables
        num => console.log('Subs', num),
        error => console.error('Error', error),
        () => console.log('El observador termino!')
      );
    /* .pipe(
      // Repite el observador n veces
      retry(2)
    ) */
  }

  ngOnDestroy(): void {
    this.subscripcion.unsubscribe();
  }


  regresaObervable(): Observable<any> {

    return new Observable((observer: Subscriber<any>) => {

      let contador = 0;
      let interval = setInterval(() => {
        contador += 1;

        // Objeto de salida de la respuesta tipo API
        const salida = {
          valor: contador
        }

        // Notifica los siguientes registros
        observer.next(salida);

        /* if (contador === 3) {
          clearInterval(interval);
          //Completa el objetivo pero sigue observando
          observer.complete();
        } */

        /* if (contador === 2) {
          //clearInterval(interval);
          observer.error('Auxilio');
        } */

      }, 1000);

    }).pipe(
      // Realiza un filtro del resultado del objeto res
      map(res => res.valor),
      filter((valor, index) => {
        // Emite el valor y el index del arreglo
        //console.log('Filter>', valor, index);

        if ((valor % 2 === 1)) {
          // impar
          return true;
        } else {
          // par
          return false;
        }

      })
    )
  }

}
