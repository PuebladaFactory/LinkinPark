import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxPrintElementService } from 'ngx-print-element';
import { Clientes } from 'src/app/interfaces/clientes';
import { Vehiculo } from 'src/app/interfaces/vehiculo';
import { EstadoCajaService } from 'src/app/servicios/caja/estado-caja.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-pago-abono',
  templateUrl: './pago-abono.component.html',
  styleUrls: ['./pago-abono.component.scss'],
})
export class PagoAbonoComponent implements OnInit {
  @Input() fromParent: any;
  titulo!: any;
  item!: Vehiculo;
  cliente: Clientes;

  fechaHoraActual: Date = new Date();

  constructor(
    public activeModal: NgbActiveModal,
    public printService: NgxPrintElementService,
    private estadoCajaService: EstadoCajaService
  ) {}

  ngOnInit(): void {
    //console.log('fromParent: ', this.fromParent);

    this.titulo = this.fromParent.modo;
    this.item = this.fromParent.item;
    this.cliente = this.fromParent.cliente;
    console.log("pago abono", this.titulo)

    setInterval(() => {
      this.fechaHoraActual = new Date();
    }, 1000);
  }

  closeModal() {
    let value = {
      op: this.titulo,
      item: this.item,
    };
    this.activeModal.close(value);
  }

  pago() {
    let modoCajaActual: string = '';
    this.estadoCajaService.modoCaja$.subscribe((modo) => (modoCajaActual = modo));

    if (modoCajaActual !== 'abierta') {
      Swal.fire('Debe abrir la caja antes de cobrar un abono.');
      return;
    }

    Swal.fire({
      title: '¿Desea confirmar el pago?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Pago efectuado');
        this.printService.print('ticket'); // Llamar al método print() con el id del elemento a imprimir
        this.closeModal();
      }
    });
  }
}