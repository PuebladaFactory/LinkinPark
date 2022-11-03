import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-btn-editar',
  template: `
<button class="btn btn-primary" style="border-radius: 10%;  margin: 10px; width:87px" >
    <i class="fa fa-pencil"></i>
    {{name || "Editar"}}
</button> 
  `,
  styles: [
    `

    `
  ]
})
export class BtnEditarComponent implements OnInit {

  @Input() name?: string;
  constructor() { }

  ngOnInit(): void {
  }

}
