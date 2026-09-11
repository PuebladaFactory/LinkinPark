import { Component, EventEmitter, Input, OnInit, OnDestroy, Output, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LanguageApp } from 'src/app/shared/DTLanguage';
import { StorageService } from 'src/app/servicios/storage/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-playa-view',
  templateUrl: './playa-view.component.html',
  styleUrls: ['./playa-view.component.scss'],
})
export class PlayaViewComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  @Input() data?: any;
  @Output() newItemEvent = new EventEmitter<any>();
  titulo: string = 'Playa';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  msg: any;
  user$!: any; //para roles de usuario

  private dataSubscription?: Subscription;
  private isRerendering = false;

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.user$ = this.storageService.usuario$;
    this.setearDataTable();

    // debounceTime agrupa varios cambios seguidos (por ejemplo, cuando la
    // pestaña estuvo inactiva y Firestore sincroniza de golpe varios cambios
    // pendientes) en uno solo, evitando destruir/reinicializar la tabla varias
    // veces casi al mismo tiempo. Eso era lo que disparaba
    // "Cannot reinitialise DataTable" repetidas veces.
    this.dataSubscription = this.data
      .pipe(debounceTime(300))
      .subscribe((items: any[]) => {
        if (items && items.length > 0) {
          this.rerenderTabla();
        }
      });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dataSubscription?.unsubscribe();
  }

  rerenderTabla(): void {
    // evita solapar un destroy/reinit mientras el anterior todavia no termino
    if (this.isRerendering) {
      return;
    }
    this.isRerendering = true;

    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance
        .then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next(null);
        })
        .finally(() => {
          this.isRerendering = false;
        });
    } else {
      this.dtTrigger.next(null);
      this.isRerendering = false;
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