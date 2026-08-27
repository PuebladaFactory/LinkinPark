import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // servicios modal
import { CajaStorageService } from 'src/app/servicios/caja/caja-storage.service';
import { LogService } from 'src/app/servicios/log.service';
import { StorageService } from 'src/app/servicios/storage/storage.service';
import { TicketEntradaComponent } from 'src/app/ticket/ticket-entrada/ticket-entrada.component';
import { PlayaFormComponent } from '../playa-form/playa-form.component';

@Component({
  selector: 'app-playa-control',
  template: `
    <app-inicio
      class="d-flex justify-content-center mt-5"
      (newItemEvent)="getMsg($event)"
    ></app-inicio>

    <app-playa-view
      [data]="data$"
      (newItemEvent)="getMsg($event)"
    ></app-playa-view>
  `,

  styleUrls: ['./playa-control.component.scss'],
})
export class PlayaControlComponent implements OnInit {
  // nombre del crud / componente
  componente: string = 'playa';

  // data recibida del crud
  data$: any;

  constructor(
    private modalService: NgbModal,
    private logger: LogService,
    private storageService: StorageService,
    private cajaStorageService: CajaStorageService
  ) {}

  ngOnInit(): void {
    this.data$ = this.storageService.playa$;

  }



  /// RECIBE MENSAJE DE LA VISTA ///

  getMsg(msg: any) {
  if (msg.op === 'BorradoAdmin') {
    this.storageService.deleteItem(this.componente, msg.item);
    this.logger.log('borrado.admin', msg.item);
  } else {
    this.openForm(msg.op, msg.item);
  }
}

  /// MODAL DEL FORM SEGUN INFO DE LA VISTA ////

  openForm(modo: string, item: any) {
    {
      const modalRef = this.modalService.open(PlayaFormComponent, {
        windowClass: 'myCustomModalClass',

      });

      let info = {
        modo: modo,
        item: item,
      };

      modalRef.componentInstance.fromParent = info;
      modalRef.result.then(
        (result) => {
          this.flowOp(result.op, result.item);
        },
        (reason) => {}
      );
    }
  }

  //// FLUJO DE OPERACIONES SEGUN OP FORM /////

  flowOp(op: string, item: any) {
    // this.selectCrudOp(op, item); // hace el crud
    this.selectTicketOp(op, item); // hace operacion de ticket si corresponde
  }

  ////// SELECCIONAR OPERACION CRUD  //////

  selectCrudOp(op: string, item: any) {
    switch (op) {
      case 'Agregar': {
        this.storageService.addItem(this.componente, item);
        break;
      }

      case 'Editar': {
        this.storageService.updateItem(this.componente, item);
        break;
      }
      case 'Eliminar': {
        //sacar de playa
        this.storageService.deleteItem(this.componente, item);
        // facturar
        this.storageService.addItem('facturacion', item);
        // Generar el ingreso en Caja
        this.ingresarPagoEnCaja(item);

        break;
      }

      default: {
        // console.log('sin operacion en case crud');
        break;
      }
    }
  }

  // ingresarPagoEnCaja(item: { patente: any; saldo: any }) {
  //   let ndate = new Date();
  //   let opCaja = {
  //     concepto: item.patente,
  //     fecha: ndate, // item.fechas["fechaSalidaDate"],
  //     importe: item.saldo,
  //     operacion: 'ingreso',
  //   };

  //   this.cajaStorageService.addItem('caja', opCaja);
  // }

  ingresarPagoEnCaja(item: { patente: any; saldo: any }) {
    let ndate = new Date();
    let opCaja = {
      concepto: 'egreso ' + item.patente, // Se agrega la palabra "egreso" seguida de la patente
      fecha: ndate, // item.fechas["fechaSalidaDate"],
      importe: item.saldo,
      operacion: 'ingreso',
    };
    this.cajaStorageService.addItem('caja', opCaja);
  }
  

  
  /////////////////////////////////////////
  ///// ELEGIR OPERACION DE TICKET/////////

  selectTicketOp(op: string, item: any) {
    switch (op) {
      case 'Agregar': {
        this.openTicket('Ticket Ingreso', item,op);
        break;
      }

      case 'Eliminar': {
        this.openTicket('Ticket Salida', item,op);
        break;
      }

      case 'Reimprimir': {
        this.openTicket('Reimprimir', item,op);
        this.logger.log('ticket-reimpresion', item);

        break;
      }

      case 'Editar': {
        this.selectCrudOp(op, item);
        break;
      }

      default: {
      //  console.log('sin operacion en case crud');
        break;
      }
    }
  }

  /////  ABRIR FORMULARIO TICKET //////

  openTicket(modo: string, item: any, op:any) {
    {
   
      const modalRef = this.modalService.open(TicketEntradaComponent, {
        windowClass: 'myCustomModalClass',
      });

      let info = {
        modo: modo,
        item: item,
      };

      modalRef.componentInstance.fromParent = info;
      modalRef.result.then(
        (result) => {
         // console.log (modo, item)
          this.selectCrudOp(op, item);
          // this.selectTicketOp(result.op, result.item);
        },
        (reason) => {
          // (reason)
        }
      );
    }
  }
}
