import { Injectable } from '@angular/core';
import moment from 'moment';
import { Vehiculo } from 'src/app/interfaces/vehiculo';
import { DbFirestoreService } from '../database/db-firestore.service';
import { CajaStorageService } from '../caja/caja-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AbonoService {
  constructor(
    private dbFirestoreService: DbFirestoreService,
    private cajaStorageService: CajaStorageService
  ) {}

  verificarAbonos(data: any) {
    let vehiculos = data;

    let fecha = moment().toDate().getTime(); //obtiene la fecha actual en milisegundos
    // console.log('abono service. date: ', fecha);

    vehiculos.forEach(
      (vehiculo: {
        abonoFin: { seconds: number; nanoseconds: number } | null;
        estado: number;
      }) => {
        if (vehiculo.abonoFin != null) {
          //si se cargo el vehiculo pero no se efectuo el pago, las fechas del abono estan en null

          //firestore guarda las fecha como timestamp. para poder trabajar con ellas hay q modificarlas
          // se utiliza el metodo toDate(), pero por algun motivo no funciona.
          //asi q lo q hace es transformar manualmente el timestamp y se obtienen los milisegundos (getTime()) para poder compararlos con la fecha actual

          const convertirTimestamp = new Date(
            vehiculo.abonoFin.seconds * 1000 +
              vehiculo.abonoFin.nanoseconds / 1000000
          );
          const date = convertirTimestamp.getTime();
          const atTime = convertirTimestamp.toLocaleTimeString();

          // console.log('date: ', date);
          // console.log('atTime: ', atTime);

          if (date < fecha) {
            //si la fecha es del abono es menor q la fecha actual, significa q el abono esta vencido
            //se cambia el estado del abono vencido.

            if (vehiculo.estado !== 0) {
              vehiculo.estado = 0;
              //console.log("abono service. verificarAbonos: ", vehiculo);
              this.dbFirestoreService.update('vehiculos', vehiculo);
              // console.log ("abono service update " ,vehiculo)
            }
          }
        }
      }
    );
  }

  setearFinAbono(vehiculo: Vehiculo) {
    //le agrega la fecha del fin del abono dependiendo de la unidad de la tarifa

    switch (vehiculo.tarifa.unidad_tiempo) {
      case 'mes': {
        let finAbono = moment(vehiculo.abonoInicio)
          .add(vehiculo.tarifa.fraccion, 'months')
          .toDate();
        // console.log('servicio abono, fecha fin abono', finAbono);
        return finAbono;
      }
      case 'semana': {
        let finAbono = moment(vehiculo.abonoInicio)
          .add(vehiculo.tarifa.fraccion, 'weeks')
          .toDate();
        // console.log('servicio abono, fecha fin abono', finAbono);
        return finAbono;
      }
      case 'hora': {
        let finAbono = moment(vehiculo.abonoInicio)
          .add(vehiculo.tarifa.fraccion, 'hours')
          .toDate();
        // console.log('servicio abono, fecha fin abono', finAbono);
        return finAbono;
      }
      case 'minutos': {
        let finAbono = moment(vehiculo.abonoInicio)
          .add(vehiculo.tarifa.fraccion, 'minutes')
          .toDate();
        // console.log('servicio abono, fecha fin abono', finAbono);
        return finAbono;
      }
      default: {
        return null;
      }
    }
  }

  pagarAbonoVehiculo(vehiculo: any, result: any) {
    this.cambiarEstadoAbono(vehiculo);
    this.fechasAbono(vehiculo);
    this.ingresarPagoEnCaja(result);
  }

  ingresarPagoEnCaja(result: any) {
    let ndate = new Date();
    let opCaja = {
      concepto: 'Pago Abono: ' + result.item.patente,
      fecha: ndate, // item.fechas["fechaSalidaDate"],
      importe: result.item.tarifa.valor,
      operacion: 'ingreso',
    };

    this.cajaStorageService.addItem('caja', opCaja);
  }

  cambiarEstadoAbono(vehiculo: Vehiculo) {
    vehiculo.estado = 1;
  }

  fechasAbono(vehiculo: Vehiculo) {
    vehiculo.abonoInicio = new Date();
    vehiculo.abonoFin = this.setearFinAbono(vehiculo);
  }
}
