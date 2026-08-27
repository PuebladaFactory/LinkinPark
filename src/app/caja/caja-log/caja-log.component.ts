import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from 'src/app/servicios/storage/storage.service';
import { LanguageApp } from 'src/app/shared/DTLanguage';
import { SesionViewComponent } from '../sesion-view/sesion-view.component';

@Component({
  selector: 'app-caja-log',
  templateUrl: './caja-log.component.html',
  styleUrls: ['./caja-log.component.scss'],
})
export class CajaLogComponent implements OnInit {
  data: any;
  dtOptions: DataTables.Settings = {};
  componente: string = 'cajaLog';
  sesionOps: any;

  constructor(
    private storageService: StorageService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.data = this.storageService.cajaLog$;

    this.setDataTable();
  }

  setDataTable() {
    this.dtOptions = {
      dom: 't<"bottom"riflp><"clear">',
      language: LanguageApp.spanish_datatables,
      columnDefs: [
        { width: '3rem', targets: 0 },
        { orderable: false, targets: 0 },
      ],
      order: [[2, 'desc']], // ordena por la columna Cierre (indice 2)
      responsive: true,
    };
  }

  msgBack(item: any) {
    {
      const modalRef = this.modalService.open(SesionViewComponent, {
        scrollable: true,
        windowClass: 'myCustomModalClass',
      });
      modalRef.componentInstance.fromParent = item;
    }
  }

  // interface cajaLog

  // apertura: 5 de diciembre de 2022, 15:13:36 UTC-3
  // cierre: 6 de diciembre de 2022, 19:09:20 UTC-3
  // estado: "abierto  | cerrada "
  // id: firebaseid             // es el id de la sesion para las operaciones de caja
  // userDisplayName: ""        // usuario owner de la sesion
  // userUid:                   // id del usuario owner de la sesion
}