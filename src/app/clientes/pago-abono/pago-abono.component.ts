import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxPrintElementService } from 'ngx-print-element';
import { Clientes } from 'src/app/interfaces/clientes';
import { Vehiculo } from 'src/app/interfaces/vehiculo';
import { Tarifas } from 'src/app/interfaces/tarifas';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // sacar datos abono


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
  tarifa: Tarifas;

  

  fechaHoraActual: Date = new Date();
  valorObtenido: any;

  constructor(
    public activeModal: NgbActiveModal,
    public printService: NgxPrintElementService,
    private valorAbono: AngularFirestore // sacar datos abono
    //public tarifas: Tarifas
  ) {}

  ngOnInit(): void {
    //console.log('fromParent: ', this.fromParent);

    this.titulo = this.fromParent.modo;
    this.item = this.fromParent.item;
    this.cliente = this.fromParent.cliente;
    console.log("pago abono-titulo", this.titulo)
    console.log("tarifa abono guardado valor", this.item.tarifa.valor)
    console.log("valor tarifa abono actual2", this.valorObtenido) // error en la lectura de esta variable

    setInterval(() => {
      this.fechaHoraActual = new Date();
    }, 1000);
  }
   ValAbono() {
  this.valorAbono.doc<any>('dummy-park.firebaseapp.com/playaSanLuisCba/datos/tarifas/JUiA1wk3uRmsGUoEgy9n').valueChanges().subscribe(data => {
    this.valorObtenido = data;
    console.log(this.valorObtenido); // Aquí tienes el valor del documento
  });
}

  closeModal() {
    let value = {
      op: this.titulo,
      item: this.item,
    };
    this.activeModal.close(value);
  }

  pago() {
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
