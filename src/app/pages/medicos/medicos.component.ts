import { Component, OnInit } from '@angular/core';

import { Medico } from '../../models/medico';
import { MedicoService } from '../../services/service.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
    `
    .img-50{
      width: 100px;
      height: 100px;
    }
    `
  ]
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  cargando: boolean = true;

  desde: number = 0;

  constructor(
    public _medicoService: MedicoService,
  ) { }

  ngOnInit(): void {
    this.cargarMedicos();
  }

  cargarMedicos() {

    this.cargando = true;

    this._medicoService.cargarMedicos(this.desde)
      .subscribe((res: any) => {
        this.medicos = res;
        this.cargando = false;
      })

  }

  // Busca Medicos
  buscarMedico(termino: string) {
    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }
    this.cargando = true;

    this._medicoService.buscarMedico(termino)
      .subscribe((medico: Medico[]) => {
        this.medicos = medico;
        this.cargando = false;
      })
  }

  // Permite cuantos usuarios mostrar
  cambiarDesde(valor: number) {
    let desde = this.desde + valor;

    if (desde >= this._medicoService.totalMedicos) {
      return;
    }

    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarMedicos();

  }

  borrarMedico(medico: Medico) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-outline-success btn-rounded m-2',
        cancelButton: 'btn btn-outline-danger btn-rounded'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Está seguro?',
      text: "Esta a punto de borrar el medico  " + medico.nombres + " " + medico.apellidos,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, quiero borrarlo',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then(error => {
      if (error.value) {

        // Delete user
        this._medicoService.borrarMedico(medico._id)
          .subscribe(() => {
            this.cargarMedicos();
          })

        swalWithBootstrapButtons.fire(
          '¡Médico borrado!',
          'El médico a sido eliminado',
          'success'
        )

      } else if (
        /* Read more about handling dismissals below */
        error.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          '',
          'error'
        )
      }
    });

  }

}
