import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalUploadService {

  public tipo: string;
  public id: string;

  // Inicie el modal oculto
  public oculto: string = 'oculto';

  // Notifica res del server en cualquier momento
  public notificacion = new EventEmitter<any>();

  constructor() {

  }

  ocultarModal(){
    this.oculto = 'oculto';
    this.tipo = null;
    this.id = null;
  }

  mostrarModal(tipo: string, id: string){
    this.oculto = '';
    this.tipo = tipo;
    this.id = id;
  }
}
