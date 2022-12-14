import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'  // servicios modal
import { InterOpService } from 'src/app/servicios/inter-op.service';
import { LogService } from 'src/app/servicios/log.service';
import { StorageService } from 'src/app/servicios/storage/storage.service';

import { TicketEntradaComponent } from 'src/app/ticket-entrada/ticket-entrada.component';
import { PlayaFormComponent } from '../playa-form/playa-form.component';


@Component({
  selector: 'app-playa-control',
  template: `

<app-inicio class="d-flex justify-content-center mt-5"  
 (newItemEvent)="getMsg($event)"
></app-inicio>

<app-playa-view
  [data]=data$
 (newItemEvent)="getMsg($event)"
  ></app-playa-view>

`,

  styleUrls: ['./playa-control.component.scss']
})
export class PlayaControlComponent implements OnInit {

  // nombre del crud / componente
  componente: string = 'playa'

  // data recibida del crud
  data$: any;

  constructor(private modalService: NgbModal,
    private fb: FormBuilder,
    private interOpService: InterOpService,
    private logger: LogService,
    private storageService: StorageService,

  ) { }


  ngOnInit(): void {
    this.data$ = this.storageService.playa$
    this.getuser()

  }



  getuser() {
    console.log(JSON.parse(localStorage.getItem('user') || `{}`))

  }

  /// RECIBE MENSAJE DE LA VISTA ///

  getMsg(msg: any) {
    // console.log(msg, "from parent");
    this.openForm(msg.op, msg.item)
  }


  /// MODAL DEL FORM SEGUN INFO DE LA VISTA ////


  openForm(modo: string, item: any) {
    {
      const modalRef = this.modalService.open(PlayaFormComponent,
        {
          // scrollable: false,
          windowClass: 'myCustomModalClass',
          // keyboard: false,
          // backdrop: 'static'
        })

      let info = {
        modo: modo,
        item: item

      }


      modalRef.componentInstance.fromParent = info;
      modalRef.result.then((result) => {
        //console.log("result from control","op", result.op,"item", result.item);

        // this.getXps();  
        this.flowOp(result.op, result.item)
          ;
      }, (reason) => { });
    }
  }


  //// FLUJO DE OPERACIONES SEGUN OP FORM /////

  flowOp(op: string, item: any) {
    this.selectCrudOp(op, item)   // hace el crud
    this.selectTicketOp(op, item)  // hace operacion de ticket si corresponde
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
        this.storageService.deleteItem(this.componente, item);
        this.interOpService.addItem("facturacion", item)

        // pasar a funcion que genere el item
        let ndate = new Date()
        this.interOpService.addItem("caja", {
          "concepto": item.patente,
          "fecha": ndate,// item.fechas["fechaSalidaDate"],
          "importe": item.saldo,
          "operacion": "ingreso"
        })

        break;
      }

      default: {
        console.log("sin operacion en case crud")
        break;
      }
    }
  };

  /////////////////////////////////////////
  ///// ELEGIR OPERACION DE TICKET/////////

  selectTicketOp(op: string, item: any) {

    switch (op) {
      case 'Agregar': {
        this.openTicket("Ticket Ingreso", item)
        break;
      }

      case 'Eliminar': {
        this.openTicket("Ticket Salida", item)
        break;
      }

      case 'Reimprimir': {

        this.openTicket("Reimprimir", item);
        this.logger.log("ticket-reimpresion", item);

        break;
      }


      default: {
        console.log("sin operacion en case crud")
        break;
      }
    }
  };



  /////  ABRIR FORMULARIO TICKET //////

  openTicket(modo: string, item: any) {
    {
      const modalRef = this.modalService.open(TicketEntradaComponent,
        {

          windowClass: 'myCustomModalClass',

        })

      let info = {
        modo: modo,
        item: item

      }


      modalRef.componentInstance.fromParent = info;
      modalRef.result.then((result) => {
        // console.log("result from control","op", result.op,"item", result.item);
        this.selectTicketOp(result.op, result.item)
          ;
      }, (reason) => { });
    }
  }

}