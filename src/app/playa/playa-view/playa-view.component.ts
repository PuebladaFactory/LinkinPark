import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LanguageApp } from 'src/app/shared/DTLanguage';
import { StorageService } from 'src/app/servicios/storage/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-playa-view',
  templateUrl: './playa-view.component.html',
  styleUrls: ['./playa-view.component.scss'],
})
export class PlayaViewComponent implements OnInit, OnChanges {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  @Input() data?: any;
  @Output() newItemEvent = new EventEmitter<any>();
  titulo: string = 'Playa';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  msg: any;
  user$!: any; //para roles de usuario

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.user$ = this.storageService.usuario$;
    this.setearDataTable();

    // nos suscribimos al observable que llega por @Input
    this.data.subscribe((items: any[]) => {
      if (items && items.length > 0) {
        this.rerenderTabla();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // por si el @Input cambia de referencia (por ejemplo, cambio de coleccion)
    if (changes['data'] && !changes['data'].firstChange) {
      this.data.subscribe((items: any[]) => {
        if (items && items.length > 0) {
          this.rerenderTabla();
        }
      });
    }
  }

  rerenderTabla(): void {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next(null);
      });
    } else {
      this.dtTrigger.next(null);
    }
  }

  msgBack(op: string, item: any) {
    let value = {
      op: op,
      item: item,
    };

    if (op === 'Reimprimir') {
      Swal.fire({
        title: '¿Desea reimprimir el ticket?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.newItemEvent.emit(value);
        }
      });
    } else if (op === 'BorradoAdmin') {
      Swal.fire({
        title: '¿Desea sacar el vehiculo sin cobrar?',
        text: ' Esta accion queda en el log',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.newItemEvent.emit(value);
        }
      });
    } else {
      this.newItemEvent.emit(value);
    }
  }

  setearDataTable() {
    this.dtOptions = {
      dom: 't<"bottom"riflp><"clear">',
      language: LanguageApp.spanish_datatables,
      columnDefs: [
        { orderable: false, targets: [0, 5] },
        { searchable: false, targets: [5] },
      ],
    };
  }
}