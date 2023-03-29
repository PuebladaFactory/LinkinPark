import { Injectable } from '@angular/core';
import { CajaStorageService } from '../caja/caja-storage.service';
import { EstadoCajaService } from '../caja/estado-caja.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class GetInfoService {
  nombreUsuario!: string;
  listadoPatentes: string[] = [];
  sesionCajaId:any
  sesionCajaApertura:any
  sesionCajaCierre:any



  private user$: any;
  private playa$: any;
  private sesionCaja$:any

  constructor(
    private storageService: StorageService,
    private cajaStorageService: CajaStorageService,
    private estadoCajaService: EstadoCajaService,

  ) {
    this.storageService.usuario$.subscribe((data)               => (this.user$ = data)),
    this.storageService.playa$.subscribe((data)                 => (this.playa$ = data)),
    this.estadoCajaService.sesionCaja$.subscribe((data)         => (this.sesionCaja$ = data ))
  }

  getUser() {
    this.nombreUsuario = this.user$['displayName'];
  }

  listarPatentes() {
    let playa = this.playa$;

    //recorre playa buscando barcode
    for (var it of playa) {
      let pat = it['patente'];
      // console.log(cod, pat);
      this.listadoPatentes.push(pat);
    }
    console.log('aver 2', this.listadoPatentes);
  }

  getSesionCaja(){
    this.sesionCajaId = this.sesionCaja$.id
    this.sesionCajaApertura= this.sesionCaja$.apertura

    }
    


  resetAll() {
    this.nombreUsuario = '';
    this.listadoPatentes = [];
    this.sesionCajaId =""  
    this.sesionCajaApertura=""
    this.sesionCajaCierre=""
    

  }

  getCierreCaja() {
    this.resetAll();
    this.getUser();
    this.listarPatentes()
    this.getSesionCaja()
    this.sesionCajaCierre = new Date()
  }
}
