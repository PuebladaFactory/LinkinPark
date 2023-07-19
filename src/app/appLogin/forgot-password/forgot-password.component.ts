import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/autentificacion/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls:  ['../../shared/login-styles.scss']
})
export class ForgotPasswordComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit(): void {}
}
