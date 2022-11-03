import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'  // servicios modal
import { InterOpService } from 'src/app/servicios/inter-op.service';
import { LoggedService } from 'src/app/servicios/logged.service';
import { ServicioDatosService } from 'src/app/servicios/servicio-datos.service';
import { TicketEntradaComponent } from 'src/app/ticket-entrada/ticket-entrada.component';
import { PlayaFormComponent } from '../playa-form/playa-form.component';


@Component({
  selector: 'app-playa-control',
  template: `


<app-playa-view
  [data]=data 
  [$estado]=$estado   
 (newItemEvent)="getMsg($event)"
  ></app-playa-view>
  
  
              `,

  styleUrls: ['./playa-control.component.scss']
})
export class PlayaControlComponent implements OnInit {



  // nombre del crud / componente
  componente: string = 'playa'

  // propiedades logged service
  $estado;

  // data recibida del crud
  data!: [];



  constructor(private modalService: NgbModal,
    private loggedService: LoggedService,
    private fb: FormBuilder,
    private servicioDatosService: ServicioDatosService,
    private interOpService: InterOpService,
  ) {

    this.$estado = loggedService.logged$;

  }


  ngOnInit(): void {
    this.$estado.subscribe
    this.getAll();  //tomar datos de los vehiculos en playa

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
        // console.log("result from control","op", result.op,"item", result.item);

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
        this.addItem(this.componente, item);
        break;
      }

      case 'Editar': {
        this.updateItem(this.componente, item);
        break;
      }
      case 'Salida': {
        this.deleteItem(this.componente, item);
        this.interOpService.addItem("facturacion", item)
        break;
      }

      default: {
        console.log("sin operacion en case crud")
        break;
      }
    }
  };


  ///////////////////////////////
  ///// OPERACIONES CRUD ////////

  getAll(): void {
    this.servicioDatosService.getAll(this.componente).subscribe(
      datos => {
        this.data = datos;
        // console.log("get all ", this.componente, this.data)

      }
    );
  }


  deleteItem(componente: string, item: any): void {

    console.log("delete component", item, item.id)
    this.servicioDatosService.deleteItem(componente, item.id)
      .subscribe
      (data => {
        this.data = data;
        this.ngOnInit();
      })
  }

  addItem(componente: string, item: any): void {

    console.log("add itemcomponent", item,)
    this.servicioDatosService.addItem(componente, item)
      .subscribe
      (data => {
        this.data = data;
        this.ngOnInit();
      });

  }

  updateItem(componente: string, item: any): void {

    this.servicioDatosService.updateItem(componente, item, item.id)
      .subscribe
      (data => {
        this.data = data;
        this.ngOnInit();
      });

  }

  /////////////////////////////////////////
  ///// ELEGIR OPERACION DE TICKET/////////

  selectTicketOp(op: string, item: any) {

    switch (op) {
      case 'Agregar': {
        this.openTicket("Ticket Ingreso", item)
        break;
      }

      case 'Salida': {
        this.openTicket("Ticket Salida", item)
        break;
      }
      case 'Reimprimir': {
        this.openTicket("Reimprimir", item);
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
        // console.log("result from control","op", result.op,"item", result.item);
        this.selectTicketOp(result.op, result.item)
          ;
      }, (reason) => { });
    }
  }


}