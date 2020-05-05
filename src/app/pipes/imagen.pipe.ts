import { Pipe, PipeTransform } from '@angular/core';
import { URL_API } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: string = "usuarios"): any {
    let url = URL_API + '/img';

    // Si no tiene img setea la default
    if (!img) {
      return url + '/usuarios/xxxx';
    }

    // Si el nombre de la img empieza por https://....
    if (img.indexOf('https') >= 0) {
      return img;
    }

    // Sino busca el tipo
    switch (tipo) {
      case 'usuario':
        url += '/usuarios/' + img;
        break;

      case 'hospital':
        url += '/hospitales/' + img;
        break;

      case 'medico':
        url += '/medicos/' + img;
        break;

      default:
        //console.log("Tipo de imagen no existe: usuarios, medicos, hospitales");
        url += '/usuarios/xxxx';

    }
    return url;
  }

}
