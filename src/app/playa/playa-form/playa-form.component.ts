import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { Tarifas } from 'src/app/interfaces/tarifas';
import { Fechas } from 'src/app/interfaces/fechas';
import { ValidarPatenteService } from 'src/app/servicios/patentes/validar-patente.service';
import { CalculoFechasService } from 'src/app/servicios/Fechas/calculo-fechas.service';
import { EstadiaService } from 'src/app/servicios/facturacion/estadia.service';
import { ClientesService } from 'src/app/servicios/clientes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-playa-form',
  templateUrl: './playa-form.component.html',
  styleUrls: ['./playa-form.component.css'],
})
export class PlayaFormComponent implements OnInit {
  @Input() fromParent: any;
  barCodeId: string = 'BCN';
  editForm!: any;
  titulo!: string;
  item!: any;
  fecha!: Date;
  fechas: Fechas = {
    fechaDate: '',
    fechaIngreso: '',
    horaIngreso: '',
    fechaSalidaDate: '',
    fechaSalida: '',
    horaSalida: '',
    estadia: 0,
  };
  fechaSalida!: Date;
  horaIngreso!: any;
  tarifas!: Tarifas[];
  componenteTarifas: string = 'tarifas';
  puestoEstacionamiento!: any;
  tarifaSeleccionada!: Tarifas;
  saldo!: number;
  patentesPlaya!: any;
  clienteExiste: any;
  sinEdicion: boolean = true;
  vehiculoEliminar!: any;
  tarifaEliminar: Tarifas;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private validacionPatente: ValidarPatenteService,
    private fechaService: CalculoFechasService,
    private estadiaService: EstadiaService,
    private clientesService: ClientesService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.getTarifas();
    this.getPlaya();
    this.setearComponente();
  }

  createForm() {
    this.editForm = this.fb.group({
      patente: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          this.validacionPatente.evaluarPatente(),
        ],
      ],
      descripcion: [''],
    });
  }

  setearComponente() {
    this.titulo = this.fromParent.modo;
    this.item = this.fromParent.item;
    this.editForm.patchValue({
      patente: this.fromParent.item.patente,
    });

    switch (this.titulo) {
      case 'Agregar': {
        this.saldo = 0;
        this.item.id = '';
        this.buscarPatenteEnPlaya();
        this.configurarFecha();
        this.chequearSiEsCliente();
        break;
      }

      case 'Editar': {
        this.sinEdicion = false;
        this.saldo = 0;
        this.tarifaSeleccionada = this.item.tarifa;
        this.fechas = this.item.fechas;
        this.configurarForm();
        break;
      }
      case 'Eliminar': {
        this.buscarPatenteEnPlaya();
        this.egresoVehiculo();
        this.pruebaCierreHora();
        break;
      }

      case 'Reimprimir': {
        this.saldo = 0;
        this.tarifaSeleccionada = this.item.tarifa;
        this.fechas = this.item.fechas;
        this.armarPuestoEstacionamiento();

        break;
      }

      default: {
        break;
      }
    }
  }

  get Patente() {
    return this.editForm.get('patente');
  }

  getPlaya() {
    this.patentesPlaya = JSON.parse(localStorage.getItem('playa') || `{}`);
  }

  getTarifas() {
    this.tarifas = JSON.parse(localStorage.getItem('tarifas') || `{}`);
    console.log('estas son las tarifas: ', this.tarifas);
  }

  configurarForm() {
    //se configura el form con los datos del objeto
    this.editForm.patchValue({
      patente: this.item.patente,
      descripcion: this.item.descripcion,
    });
  }

  onSubmit() {
    this.guardarDatos();
  }

  guardarDatos() {
    switch (this.titulo) {
      case 'Agregar': {
        this.validarTarifa();
        break;
      }
      case 'Editar': {
        //this.validarPatente() ;
        this.getPlaya();
        this.validarTarifa();

        break;
      }
      default: {
        //console.log("algo se rompio")
        break;
      }
    }
  }

  closeModal() {
    //console.log(this.puestoEstacionamiento);

    let value = {
      op: this.titulo,
      item: this.puestoEstacionamiento,
    };
    console.log('closemodal', value);
    this.activeModal.close(value);
  }

  validarPatente() {
    let patenteValida = this.validacionPatente.validarPatente(
      this.editForm.value.patente
    );

    if (patenteValida) {
      console.log('es una patente valida');
      //this.validarTarifa()
    } else {
      console.log('no es una patente valida');
      this.activeModal.dismiss();
    }
  }

  validarTarifa() {
    if (this.tarifaSeleccionada !== undefined) {
      this.armarPuestoEstacionamiento();
    } else {
      alert('no elegiste la tarifa');
    }
  }

  buscarPatenteEnPlaya() {
    //console.log("metodo buscar patente. playa: ", this.patentesPlaya);
    let esPatenteNueva = this.validacionPatente.buscarPatentePlaya(
      this.editForm.value.patente,
      this.patentesPlaya
    );

    if (this.titulo === 'Eliminar' && esPatenteNueva) {
      this.titulo = 'ErrorEliminar';
      this.ventanaConfirmacion();
    }
    if (this.titulo === 'Agregar' && !esPatenteNueva) {
      this.titulo = 'PatenteIngresada';
      this.ventanaConfirmacion();
    }
  }

  configurarFecha() {
    this.fecha = this.fechaService.fechaActual(); // toma la fecha actual
    this.fechas.fechaIngreso = this.fechaService.fechaDia(this.fecha); // desgloza la fecha en formato (DD/MM/YYYY) y la guarda en el objeto fechas
    this.fechas.horaIngreso = this.fechaService.fechaHora(this.fecha); // desgloza la fecha en formato (hh:mm:ss) y la guarda en el objeto fechas
    this.fechas.fechaDate = this.fecha.toString();
  }

  pruebaCierreHora() {
    this.fechaSalida = this.fechaService.fechaActual(); // entrega la diferencia entre la fecha ingresada y el momento actual en minutos
    this.fechas.fechaSalida = this.fechaService.fechaDia(this.fechaSalida);
    this.fechas.horaSalida = this.fechaService.fechaHora(this.fechaSalida);
    this.fechas.estadia = this.fechaService.pruebaCierreHora(
      this.fechas.fechaDate
    );
    this.fechas.fechaSalidaDate = this.fechaSalida.toString();
    this.saldoEstadia();
  }

  changeTarifa(e: any) {
    let tarifaForm; //crea una variable para usarlo con la funcion filter
    tarifaForm = this.tarifas.filter(function (tarifas: any) {
      //devuelve otro array con lo que sea q coincida con el parametro
      return tarifas.nombre === e.target.value;
    });
    this.tarifaSeleccionada = tarifaForm[0]; //se guarda el nombre de la tarifa seleccionada en la variable
  }

  saldoEstadia() {
    this.saldo = this.estadiaService.saldoEstadia(
      this.tarifaSeleccionada,
      this.fechas.estadia
    );
    this.armarPuestoEstacionamiento();
  }

  armarPuestoEstacionamiento() {
    let fechaLimpia = this.fechas.fechaIngreso.replace(/[^0-9A-Z]+/gi, '');
    let horaLimpia = this.fechas.horaIngreso.replace(/[^0-9A-Z]+/gi, '');
    //la funcion arma el puesto
    this.puestoEstacionamiento = {
      id: this.item.id,
      patente: this.editForm.value.patente,
      fechas: this.fechas,
      tarifa: this.tarifaSeleccionada,
      descripcion: this.editForm.value.descripcion,
      saldo: this.saldo,
      codigoBarras: `${this.barCodeId}-${this.fromParent.item.patente}${fechaLimpia}${horaLimpia}`,
    };
    this.item = this.puestoEstacionamiento; //gurda el puesto en "item" para poder enviarlo
    this.ventanaConfirmacion();
  }

  chequearSiEsCliente() {
    let consulta = this.clientesService.buscarPatenteEnClientes(
      this.fromParent.item.patente
    );
    if (consulta.clienteExiste) {
      //Si el cliente existe en la base de datos
      this.clienteExiste = consulta.datosVehiculo;
      this.tarifaSeleccionada = this.clienteExiste.tarifa;
      this.titulo = 'Cliente';
      this.armarPuestoEstacionamiento();
    }
  }

  buscarTarifa(id: number) {
    let tarifas = JSON.parse(localStorage.getItem('tarifas') || `{}`);
    tarifas = tarifas.filter(function (tarifa: any) {
      return tarifa.id === id;
    });
    return tarifas[0];
  }

  egresoVehiculo() {
    this.vehiculoEliminar = this.validacionPatente.traerVehiculoPorPatente(
      this.editForm.value.patente,
      this.patentesPlaya
    );
    this.fechas = this.vehiculoEliminar.fechas;
    this.tarifaSeleccionada = this.vehiculoEliminar.tarifa;
    this.item = this.vehiculoEliminar; //gurda el puesto en "item" para poder enviarlo
  }

  ventanaConfirmacion() {
    switch (this.titulo) {
      case 'Agregar': {
        Swal.fire({
          title: '¿Desea confirmar el ingreso?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirmar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.closeModal();
          }
        });
        break;
      }
      case 'Editar': {
        Swal.fire({
          title: '¿Desea confirmar las modificaciones?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirmar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.closeModal();
          }
        });
        break;
      }
      case 'Eliminar': {
        this.closeModal();
        break;
      }
      case 'Reimprimir': {
        this.closeModal();
        break;
      }
      case 'PatenteIngresada': {
        Swal.fire('La patente ya fue ingresada');
        this.activeModal.dismiss();
        break;
      }
      case 'ErrorEliminar': {
        Swal.fire('No es una patente ingresada');
        this.activeModal.dismiss();
        break;
      }
      case 'Cliente': {
        this.titulo = 'Agregar';
        Swal.fire('Cliente con abono');
        if (this.clienteExiste.estado === 0) {
          Swal.fire({
            title: 'El abono esta vencido',
            text: 'Regularice la situación del cliente',
            icon: 'warning',
            confirmButtonColor: '#3085d6',
          }).then((result) => {
            if (result.isConfirmed) {
              this.closeModal();
            }
          });
        }
        this.closeModal();
        break;
      }
      default: {
        break;
      }
    }
  }
}
