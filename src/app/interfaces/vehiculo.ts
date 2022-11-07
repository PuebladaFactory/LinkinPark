import { Tarifas } from "./tarifas";

export interface Vehiculo {
  id: number;
  patente: string;
  marca: string;
  modelo: string;
  color: string;
  idCliente: number,
  tarifa: Tarifas;
  estado: number;
}