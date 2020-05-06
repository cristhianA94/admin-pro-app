import { Injectable } from '@angular/core';
import { URL_API } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  constructor() { }


  // Servicio con AJAX
  subirArchivo(archivo: File, tipo: string, id: string) {

    return new Promise((resolve, reject) => {

      // Permite manejar files en http
      let formData = new FormData();
      // AJAX
      let xhr = new XMLHttpRequest();

      // Params de la peticion
      formData.append('imagen', archivo, archivo.name);


      // Notifica cambios
      xhr.onreadystatechange = () => {
        // Cuando termina el proceso
        if (xhr.readyState === 4) {

          if (xhr.status === 200) {
            console.log('Imagen subida');
            // Manda obj respuesta
            resolve(JSON.parse(xhr.response));
          } else {
            console.log('Fallo la subida');
            reject(xhr.response);
          }
        }
      };

      let url = URL_API + '/uploads/' + tipo + '/' + id;

      xhr.open('PUT', url, true);
      xhr.send(formData);

    });



  }
}
