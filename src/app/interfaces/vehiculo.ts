import { Tarifas } from "./tarifas";

export interface Vehiculo {
  valor(arg0: string, valor: any): unknown;
  id: number;
  patente: string;
  marca: string;
  modelo: string;
  color: string;
  idCliente: number,
  tarifa: Tarifas;
  abonoInicio: any;
  abonoFin: any;
  estado: number;
}