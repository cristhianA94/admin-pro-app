import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HospitalService } from '../../services/hospital/hospital.service';
import { Hospital } from '../../models/hospital';
import { Medico } from '../../models/medico';
import { MedicoService } from '../../services/medico/medico.service';
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  nuevo: boolean = true;
  hospitales: Hospital[] = [];
  hospital: Hospital = new Hospital('');
  medico: Medico = new Medico();

  constructor(
    private _hospitalesService: HospitalService,
    private _medicoService: MedicoService,
    private _modalUploadService: ModalUploadService,
    public actRoute: ActivatedRoute,
    public router: Router,
  ) {
    this.actRoute.params.subscribe((params) => {
      let id = params.id;

      if (id !== "nuevo") {
        this.nuevo = false;
        this.cargarMedico(id);
      }
    });
  }

  ngOnInit(): void {
    this._hospitalesService.cargarHospitales().subscribe((hospitales: Hospital[]) => this.hospitales = hospitales);

    this._modalUploadService.notificacion.subscribe((res: any) => {
      this.medico.img = res.medico.img;

    });
  }

  cargarMedico(id: string) {
    this._medicoService.obtenerMedico(id).subscribe((medico: any) => {
      this.medico = medico;
      this.medico.hospital = medico.hospital._id;
      this.cambioHospital(this.medico.hospital);
    });
  }

  // Obtiene los hospitales en el Select
  cambioHospital(id: string) {
    this._hospitalesService.obtenerHospital(id).subscribe((hospital) => this.hospital = hospital);
  }

  cambiarFoto() {
    this._modalUploadService.mostrarModal('medicos', this.medico._id);
  }

  guardarMedico(form: NgForm) {

    if (form.invalid) {
      return;
    }

    if (this.nuevo) {
      this._medicoService.guardarMedico(this.medico).subscribe((medico: Medico) => {
        this.router.navigate(["/medico", medico._id])
      });
    } else {
      this._medicoService.actualizarMedico(this.medico).subscribe();
    }

  }
}
