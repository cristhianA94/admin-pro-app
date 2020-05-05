import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrums',
  templateUrl: './breadcrums.component.html',
  styles: [
  ]
})
export class BreadcrumsComponent implements OnInit {

  titulo: string;
  // ?Tittle: sirve para influir en el nombre de la pestaña
  // ?Meta: sirve para agregar metadatos en HTML
  constructor(private router: Router,
    private title: Title,
    private meta: Meta
  ) {

    this.getDataRoute()
      .subscribe((data) => {
        //console.log(data);
        this.titulo = data.titulo;
        // Sete el nombre del titulo en el lado de la pestaña del navegador
        this.title.setTitle(this.titulo)
        // Crea la estructura del metadato:
        // <meta name="desciption" content="textoX">
        const metaTag: MetaDefinition = {
          name: 'description',
          content: this.titulo
        }
        // Crea el metadato
        this.meta.updateTag(metaTag);
      })
  }

  ngOnInit(): void {
  }

  getDataRoute() {
    // Busca en las propiedades de las rutas
    return this.router.events.pipe(
      // Filtra solo las instancias de ActivationEnd
      filter(evento => evento instanceof ActivationEnd),
      // Filtra los que tengan Data
      filter((evento: ActivationEnd) => evento.snapshot.firstChild == null),
      // Selecciona solo los valores de Data
      map((evento: ActivationEnd) => evento.snapshot.data)
    )
  }


}
