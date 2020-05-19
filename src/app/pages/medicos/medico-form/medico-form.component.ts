import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Hospital } from 'src/app/models/hospital';
import { Medico } from 'src/app/models/medico';
import { MedicoService, HospitalService } from 'src/app/services/service.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-medico-form',
  templateUrl: './medico-form.component.html',
  styles: [
    `
    mat-form-field{
      width: 100%;
    }
    .img-50{
      width: 175px;
      height: 291px;
    }
    .pointer{
      cursor: pointer;
    }
    `
  ]
})
export class MedicoFormComponent implements OnInit {

  medico: Medico = new Medico('', '', '', '', '', '');
  hospitales: Hospital[] = [];
  hospital: Hospital = new Hospital('');

  constructor(
    public _medicoService: MedicoService,
    public _hospitalService: HospitalService,
    private activatedRoute: ActivatedRoute,
    public _modalUploadService: ModalUploadService,
    private router: Router,
  ) {
    // Obtiene el id del parametro enviado
    this.activatedRoute.params.subscribe(params => {
      let id = params.id

      if (id !== 'nuevo') {
        this.cargarMedico(id);
      }

    });
  }

  ngOnInit(): void {
    this.cargarHospitales();

    this._modalUploadService.notificacion
      .subscribe(resp => {
        this.medico.img = resp.medico.img;
      });
  }

  cargarHospitales() {
    this._hospitalService.cargarHospitales().
      subscribe(hospitales => this.hospitales = hospitales);
  }

  cargarMedico(id: string) {
    this._medicoService.obtenerMedico(id)
      .subscribe(medico => {
        this.medico = medico;
        this.medico.hospital = medico.hospital['_id'];
        this.cambiarHospital(this.medico.hospital)
      });
  }

  guardarMedico(form: NgForm) {

    if (form.invalid) {
      return;
    }

    this._medicoService.guardarMedico(this.medico)
      .subscribe(medico => {
        this.medico._id = medico._id;
        this.router.navigate(['/medico', medico._id]);
      });
  }

  actualizarMedico(form: NgForm) {

    if (form.invalid) {
      return;
    }

    this._medicoService.actualizarMedico(this.medico)
      .subscribe();

  }


  cambiarHospital(id: any) {
    this._hospitalService.obtenerHospital(id)
      .subscribe(hospital => this.hospital = hospital);
  }

  cambiarFoto() {
    this._modalUploadService.mostrarModal('medicos', this.medico._id);
  }

}
