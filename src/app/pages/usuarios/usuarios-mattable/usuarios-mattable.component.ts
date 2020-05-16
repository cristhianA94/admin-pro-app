import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { UsuarioDialogComponent } from '../usuario-dialog/usuario-dialog.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { UsuarioService } from 'src/app/services/service.index';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-usuarios-mattable',
  templateUrl: './usuarios-mattable.component.html',
  styleUrls: ['./usuarios-mattable.component.css']
})
export class UsuariosMattableComponent implements OnInit {

  displayedColumns: string[] = ['Imagen', 'Email', 'Nombres', 'Rol', 'Auth', 'Acción'];
  dataSource = new MatTableDataSource<Usuario>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  pageIndex: number = 0;
  pageSize: number = 5;

  usuarios: Usuario[];

  totalRegistros: number;
  cargando: boolean = true;


  constructor(
    public dialog: MatDialog,
    public _usuarioServ: UsuarioService,
    public actRouter: ActivatedRoute
  ) {
    //console.log(this.actRouter.snapshot.data['dataUser']);
    // ** Cargar los datos del service gracias al Resolver, mirar service.
    this.cargarUsuarios();

  }

  ngOnInit(): void {
    console.log("Coimponetn init");

  }

  // Cargar datos 
  cargarUsuarios() {

    this.cargando = true;
    var dataUser: any;

    this.actRouter.data.subscribe((res) => {
      dataUser = res.dataUser["usersDesde"];

      this.totalRegistros = dataUser.total;
      this.usuarios = dataUser.usuario;
      // Carga los datos a la tabla
      this.dataSource.data = this.usuarios;
    })

    this.cargando = false;

  }


  // Edit or delete
  openDialog(accion, obj) {
    obj.action = accion;
    const dialogRef = this.dialog.open(UsuarioDialogComponent, {
      width: '250px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update') {
        this.updateUsuario(result.data);
      } else if (result.event == 'Delete') {
        this.deleteUsuario(result.data);
      }
    });
  }

  updateUsuario(row_obj) {
    /* this.dataSource = this.dataSource.filter((value,key)=>{
      if(value.id == row_obj.id){
        value.name = row_obj.name;
      }
      return true;
    }); */
    this.table.renderRows();
  }
  deleteUsuario(row_obj) {
    /* this.dataSource = this.dataSource.filter((value,key)=>{
      return value.id != row_obj.id;
    }); */
  }

  onRowClicked(row: any) {
    console.log('Row clicked: ', row);
  }

  /* Mat Table sorter and filter */

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
