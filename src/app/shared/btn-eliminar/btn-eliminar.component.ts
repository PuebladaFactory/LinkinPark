import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-btn-eliminar',

  template: `
<button class="btn btn-success" style="border-radius: 10%; margin: 10px ; width:87px ">
  <i class="fa fa-minus"> </i>
  {{name || "Salida"}}
</button>
  `,

  styles: [
    `

    `
  ]
})

export class BtnEliminarComponent implements OnInit {

  @Input() name?: string;
  constructor() { }

  ngOnInit(): void {
  }

}
