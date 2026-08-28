import { Component, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { DbFirestoreService } from 'src/app/servicios/database/db-firestore.service';
import { LanguageApp } from 'src/app/shared/DTLanguage';

@Component({
  selector: 'app-sesion-view',
  templateUrl: './sesion-view.component.html',
  styleUrls: ['./sesion-view.component.scss'],
})
export class SesionViewComponent implements OnInit {
  @Input() fromParent: any;  // recibe la id de sesion para buscar las operaciones en caja.
  dtOptions: DataTables.Settings = {};
  data: any;
  constructor(private dbfirestoreService: DbFirestoreService) {}

  ngOnInit(): void {
    this.getSesionCajaOps(this.fromParent.id);
    this.setDataTable();
    // console.log("from parent", this.fromParent, this.fromParent.id)
  }


  setDataTable() {
    this.dtOptions = {
      dom: 't<"bottom"riflp><"clear">',
      language: LanguageApp.spanish_datatables,
    };
  }
  getSesionCajaOps(sesionId: string) {
    this.dbfirestoreService
      .getByFieldValue('caja', 'sesionId', sesionId)
      .pipe(
        tap((data) => {
          // se ordena por fecha, porque getByFieldValue no aplica orderBy
          this.data = [...data].sort((a: any, b: any) => a.fecha.seconds - b.fecha.seconds);
          // console.log('this sesion ops', this.data);
          // saldo: this.calcularSaldo(data)
        })
      )

      .subscribe();
  }
}
