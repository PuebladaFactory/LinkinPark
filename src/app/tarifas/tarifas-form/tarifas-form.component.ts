import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LogService } from 'src/app/servicios/log.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-tarifas-form',
  templateUrl: './tarifas-form.component.html',
  styleUrls: ['./tarifas-form.component.scss'],
})
export class TarifasFormComponent implements OnInit {
  @Input() fromParent: any;
  editForm!: any;
  titulo!: string;
  item!: any;
  componente: string = 'unidadTiempo';
  unidadSeleccionada!: any;
  categoriaSeleccionada!: any;
  vehiculoSeleccionado!: any;
  nombre!: any;
  nombreT!: any;
  soloVista: boolean = false;

  unidadTiempo = [
    { id: 0, unidad_tiempo: 'minutos' },
    { id: 1, unidad_tiempo: 'hora' },
    { id: 2, unidad_tiempo: 'dia' },
    { id: 3, unidad_tiempo: 'semana' },
    { id: 4, unidad_tiempo: 'mes' },
    { id: 5, unidad_tiempo: 'semestral' },
  ];

  vehiculos = [
    { id: 0, nombre: 'moto' },
    { id: 1, nombre: 'auto' },
    { id: 2, nombre: 'utilitario' },
    { id: 3, nombre: 'camioneta' },
    { id: 4, nombre: 'otro' },
  ];

  categorias = [
    { id: 0, nombre: 'moto-base' },
    { id: 1, nombre: 'auto-base' },
    { id: 2, nombre: 'utilitario-base' },
    { id: 3, nombre: 'camioneta-base' },
    { id: 4, nombre: 'promo' },
    { id: 5, nombre: 'abono' },
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private logger: LogService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    {
      // console.log('on init form', this.fromParent);
      this.titulo = this.fromParent.modo;
    }

    //estos son los distintos caminos cuando se inicia el componente
    switch (this.titulo) {
      case 'Agregar': {
        //agregar es crear una tarifa nueva. no hay que hacer nada, esta todo vacio.
        break;
      }


      case 'Editar': {
        this.item = this.fromParent.item; //si es editar, se guardan los datos q recibe el componente en this.item
        this.unidadSeleccionada = this.item.unidad_tiempo; //se guarda la unidad seleccionada en this.unidadSeleccionada
        this.categoriaSeleccionada = this.item.categoria;        //se guarda la categoria en this.categoriaSeleccionada
        this.vehiculoSeleccionado = this.item.vehiculo;        //se guarda el vehiculo en this.vehiculoSeleccionado
        this.configureForm(); //se llama al metodo para configurar el form
        break;
      }
      case 'Eliminar': {
        this.item = this.fromParent.item;
        this.closeModal();
        break;
      }

      case 'Mostrar': {
        this.item = this.fromParent.item;
        this.configureForm();
        this.soloVista = true;
        break;
      }
      default: {

      }
    }
  }

  //esto se crea cuando se construye el componente
  createForm(): void {
    this.editForm = this.fb.group({
      nombre: [''],
      unidad_tiempo: [''],
      valor: ['', Validators.pattern(/^[0-9]{1,256}$/)],
      fraccion: ['', Validators.pattern(/^[0-9]{1,256}$/)],
      categoria: [''],
      vehiculo: [''],
      tolerancia: ['', Validators.pattern(/^[0-9]{1,256}$/)],
      id: [''],
    });
  }

  get Valor() {
    return this.editForm.get('valor');
  }

  get Fraccion() {
    return this.editForm.get('fraccion');
  }

  get Tolerancia() {
    return this.editForm.get('tolerancia');
  }

  configureForm() {
    this.editForm.patchValue({
      nombre: this.item.nombre,
      unidad_tiempo: this.item.unidad_tiempo,
      valor: this.item.valor,
      fraccion: this.item.fraccion,
      vehiculo: this.item.vehiculo,
      categoria: this.item.categoria,
      tolerancia: this.item.tolerancia,
      id: this.item.id,
      
      
      //console.log("tarifa abono guardado valor", this.item.tarifa.valor)
      
    });
  }

  //esto selecciona la unidad de tiempo
  changeUnidadTiempo(e: any) {
    // console.log(e.target.value);
    /* como en la interface tarifa, el atributo unidad_tiempoes un string, no hace falta hacer
    todo lo de abajo. con guardar el valor que recibe del evento (e.target.value) alcanza*/
    
    this.unidadSeleccionada = e.target.value;
    // console.log(this.unidadSeleccionada);
  }

  //esto selecciona la unidad de tiempo
  changeCategoria(e: any) {
    // console.log(e.target.value);

    this.categoriaSeleccionada = e.target.value;
    // console.log(this.categoriaSeleccionada);
  }

  changeVehiculo(e: any) {
    // console.log(e.target.value);

    this.vehiculoSeleccionado = e.target.value;
    // console.log(this.vehiculoSeleccionado);
  }

  //esto llama el form para guardar los datos
  onSubmit() {
    this.guardarDatos();
  }

  guardarDatos() {
    //segun el camino que sea (agregar/editar/eliminar)
    //en este caso, agregar y editar hacen lo mismo
    //pero te lo dejo para que veas que son caminos distintos
    console.log('valor fraccion', this.item.valor);
    switch (this.titulo) {
      case 'Agregar': {
        this.item = this.editForm.value; //guarda los valores del form en item
        this.item.unidad_tiempo = this.unidadSeleccionada; //guarda la unidad seleccionada en el item
        this.item.categoria = this.categoriaSeleccionada; //guarda la categoria seleccionada en el item
        this.item.vehiculo = this.vehiculoSeleccionado;
        Swal.fire({
          title: '¿Desea guardar la tarifa?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirmar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.closeModal(); //cierra el modal
            console.log('valor fraccion', this.item.valor);
          }
        });

        break;
      }
      case 'Editar': {
        this.item = this.editForm.value; //guarda los valores del form en item
        this.item.unidad_tiempo = this.unidadSeleccionada; //guarda la unidad seleccionada en el item
        this.item.categoria = this.categoriaSeleccionada; //guarda la categoria seleccionada en el item
        this.item.vehiculo = this.vehiculoSeleccionado;
        Swal.fire({
          title: '¿Desea confirmar los cambios?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirmar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.closeModal(); //cierra el modal
          }
        });

        break;
      }
      default: {
        // console.log('algo se rompio');
        break;
      }
    }
  }

  closeModal() {
    let value = {
      op: this.titulo,
      item: this.item,
    };

    // console.log('closemodal', value);
    this.activeModal.close(value);
    console.log('valor fraccion', this.item.valor);
  }
}
