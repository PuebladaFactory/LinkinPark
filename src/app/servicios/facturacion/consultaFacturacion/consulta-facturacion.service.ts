import { Injectable } from '@angular/core';
import moment from 'moment';
import { DbFirestoreService } from '../../database/db-firestore.service';
import { firstValueFrom, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConsultaFacturacionService {
  consultaFacturacion = {
    fechaDesde: '',
    fechaHasta: '',
    cantidadOperacion: 0,
    total: 0,
  };


  constructor(private dbFirestoreService : DbFirestoreService) {}

 
  convertirMilisegundosAFecha(numero: number) {
    let date = moment(numero).format('YYYY MM DD hh:mm a');
    return date;
  }

  calularTotal(facturacion: any) {
    let acumulador = 0;
    facturacion.forEach((factura: any) => {
      //por cada data de facturacion
      let dato = factura; //lo guarda en una nueva variable (pq sino no lo reconocia)
      acumulador = acumulador + dato.saldo; //saca el saldo y lo guarda en un acumulador
    });
    return acumulador;
  }


// IMPLEMENTACION NUEVA CON CONSULTA A ddbb Y CACHE

private cache: Map<string, any> = new Map<string, any>();

async calcularFacturacion2(fechas: any) {
  try {
    const cacheKey = this.generateCacheKey(fechas);

    if (this.cache.has(cacheKey)) {
      // Si la consulta está en caché, se devuelve el resultado almacenado en caché
      return this.cache.get(cacheKey);
    }

    const data = await firstValueFrom(
      this.dbFirestoreService.getAllSortedBetweenDates('facturacion', 'fechaOp', 'asc', fechas.fechaDesde, fechas.fechaHasta)
        .pipe(take(1))
    );

    console.log(data);
    this.consultaFacturacion.fechaDesde = this.convertirMilisegundosAFecha(
      fechas.fechaDesde
    );
    this.consultaFacturacion.fechaHasta = this.convertirMilisegundosAFecha(
      fechas.fechaHasta
    );
    this.consultaFacturacion.cantidadOperacion = data.length;
    this.consultaFacturacion.total = this.calularTotal(data);

    let respuestaFacturacion = {
      consultaFacturacion: this.consultaFacturacion,
      facturacion: data,
    };

    // Se almacena el resultado en la caché utilizando la clave generada
    this.cache.set(cacheKey, respuestaFacturacion);

    return respuestaFacturacion;

  } catch (error) {
    console.error(error);
    throw error;
  }
}

private generateCacheKey(params: any): string {
  // Genera una clave única para cada combinación de parámetros
  // Puedes utilizar una función de hash o concatenar y formatear los parámetros en una cadena
  // Asegúrate de implementar una lógica que genere claves únicas para diferentes combinaciones de parámetros
  // En este ejemplo, se utiliza JSON.stringify para convertir los parámetros en una cadena
  return JSON.stringify(params);
}

}

