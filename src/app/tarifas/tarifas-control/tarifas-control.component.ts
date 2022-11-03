import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoggedService } from 'src/app/servicios/logged.service';
import { ServicioDatosService } from 'src/app/servicios/servicio-datos.service';
import { TarifasFormComponent } from '../tarifas-form/tarifas-form.component';
import { TarifasViewComponent } from '../tarifas-view/tarifas-view.component';


@Component({
  selector: 'app-tarifas-control',
  template: `
  <app-tarifas-view
  [data]=data 
  [$estado]=$estado   
 (newItemEvent)="getMsg($event)"
  ></app-tarifas-view>
  
              `,
  styleUrls: ['./tarifas-control.component.scss']
})
export class TarifasControlComponent implements OnInit {



componente: string = 'tarifas'




  $estado;


  data!: [];



  constructor(private modalService: NgbModal,
              private loggedService: LoggedService,
              private fb: FormBuilder,
              private servicioDatosService: ServicioDatosService
  ) {

    this.$estado = loggedService.logged$;

    }



    ngOnInit(): void {
      this.$estado.subscribe
      this.getAll(); //tomar datos de las tarifas
  }



  getMsg(msg: any) {

    this.openForm(msg.op, msg.item)
  }

  openForm(modo: string, item: any) {
    {
      const modalRef = this.modalService.open(TarifasFormComponent,
        {

          windowClass: 'myCustomModalClass',


        })

        let info = {
          modo: modo,
          item: item

        }


        modalRef.componentInstance.fromParent = info;
        modalRef.result.then((result) => {



          this.selectCrudOp(result.op, result.item)
          ;
        }, (reason) => { });
      }
    }
  


    // seleccionar operacion CRUD


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
       case 'Eliminar': {
        this.deleteItem(this.componente, item);
        break;
      }
 





      
       default: {
        console.log("sin operacion en el case crud")
        break;
      }
    }
  };
 
  // CRUD


getAll(): void {
  this.servicioDatosService.getAll(this.componente).subscribe (
  datos => {this.data = datos;
  console.log("get all ", this.componente, this.data)

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

  // console.log("add itemcomponent", item, )
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



}

