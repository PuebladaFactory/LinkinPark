import { Injectable } from '@angular/core';
import moment from 'moment';
import { Fechas } from 'src/app/interfaces/fechas';

@Injectable({
  providedIn: 'root'
})
export class CalculoFechasService {



  constructor() { }

  fechaActual(){
    moment.locale("es");
    return new Date(); 
  }

  fechaDia(fecha:Date){
    return moment(fecha).format('L');                               // desgloza la fecha en formato (DD/MM/YYYY) y devuelve un string
  }

  fechaHora(fecha:Date){
    return moment(fecha).format('LTS');                            // desgloza la fecha en formato (hh:mm:ss) y devuelve un string
  }

  pruebaCierreHora(fecha:string){  
    // pruebas para ver como obtener la diferencia entre ingreso y Salida
    
    /* let fecha1= "20/10/2022"
    let fecha2= "10:34:57"
    let fechaCierre = new Date()  
    let fechaDePrueba= moment(`${fecha1}${fecha2}`, "DDTMMTYYYYhhmmss").diff(fechaCierre, "minutes");   // entrega la diferencia entre la fecha ingresada y el momento actual en minutos
    console.log(fechaDePrueba); */
    
    let pruebaCierreHora= moment(new Date()).diff(fecha,"minutes");   // entrega la diferencia entre la fecha ingresada y el momento actual en minutos
    // console.log(`estos son los minutos de la estadia ${pruebaCierreHora}`);
    return pruebaCierreHora
  }

  tiempoEstadia(minutosEstadia:number){
    /* let estadia = moment.duration(minutos, "minutes").format(); */ // no funciona, no lo toma como valido
    let estadia:any;

    let hora:any = Math.floor(minutosEstadia / 60);
    hora = (hora < 10)? '0' + hora : hora;
    //console.log(hora);    
    let minutos:any = Math.floor(minutosEstadia % 60);
    minutos = (minutos < 10)? '0' + minutos : minutos;
    //console.log(minutos);

    estadia = `${hora}:${minutos}`
    // console.log(estadia);
   
    return estadia
    
  }



} 




