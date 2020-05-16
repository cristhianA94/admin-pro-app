import { Component, OnInit } from '@angular/core';

import { Hospital } from '../../models/hospital';
import Swal from 'sweetalert2';

import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import { HospitalService } from '../../services/hospital/hospital.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
    `
    .img-50{
      width: 100px;
      height: 100px;
      cursor: pointer;
    }
    `
  ]
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[];
  cargando: boolean = true;

  desde: number = 0;

  constructor(
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService,
  ) {
  }
  
  ngOnInit(): void {
    this.cargarhospitales();
    // Cuando se cambie de imagen recarga los users
    this._modalUploadService.notificacion
      .subscribe(() => this.cargarhospitales());
  }

  mostrarModal(id: string): void {
    this._modalUploadService.mostrarModal('hospitales', id);
  }

  cargarhospitales() {

    this.cargando = true;

    this._hospitalService.cargarHospitales(this.desde)
      .subscribe((res: any) => {
        this.hospitales = res;
        this.cargando = false;
      })

  }

  // Permite cuantos usuarios mostrar
  cambiarDesde(valor: number) {
    let desde = this.desde + valor;


    if (desde >= this._hospitalService.totalHospitales) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarhospitales();

  }

  // Busca hospitales
  buscarHospital(termino: string) {
    if (termino.length <= 0) {
      this.cargarhospitales();
      return;
    }
    this.cargando = true;

    this._hospitalService.buscarHospital(termino)
      .subscribe((hospitales: Hospital[]) => {
        this.hospitales = hospitales;
        this.cargando = false;
      })
  }

  // Crea un hospital
  async crearHospital() {

    const { value: nombre } = await Swal.fire({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del hospital',
      input: 'text',
      icon: 'info',
      inputPlaceholder: 'Nombre',
      showClass: {
        popup: 'animate__animated animate__fadeInTopRight'
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOutRight'
      }
    })

    if (nombre) {
      Swal.fire(
        `Nombre: ${nombre}`,
        '',
        'success'
      )

      let hospital = new Hospital(nombre)
      this._hospitalService.crearHospital(hospital).subscribe();
      this.cargarhospitales();
    }
  }

  actualizarHospital(hospital: Hospital) {

    this._hospitalService.actualizarHospital(hospital)
      .subscribe();

  }

  borrarHospital(hospital: Hospital) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-outline-success btn-rounded m-2',
        cancelButton: 'btn btn-outline-danger btn-rounded'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Está seguro?',
      text: "Esta a punto de borrar el hospital  " + hospital.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, quiero borrarlo',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then(error => {
      if (error.value) {

        // Delete user
        this._hospitalService.borrarHospital(hospital._id)
          .subscribe(() => {
            this.cargarhospitales();
          })

        swalWithBootstrapButtons.fire(
          '¡Hospital borrado!',
          'El hospital a sido eliminado',
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
    })

  }

}
