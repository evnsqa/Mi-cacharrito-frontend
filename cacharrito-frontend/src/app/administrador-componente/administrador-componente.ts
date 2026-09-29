import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdministradorServicio } from '../servicios/admin-servicio';
import { Router } from '@angular/router';
import { Navegacion } from '../navegacion/navegacion';

@Component({
  imports: [ FormsModule, Navegacion],
  selector: 'app-administrador-componente',
  styleUrl: './administrador-componente.css',
  templateUrl: './administrador-componente.html',
})
export class AdministradorComponente {

  usuarioLogin: string = '';
  passwordLogin: string = '';

  constructor(private adminServicio: AdministradorServicio, private router: Router){}

  iniciarSesion() {
    this.adminServicio.loginAdministrador(this.usuarioLogin, this.passwordLogin).subscribe({
      next: (dato) => {
        console.log(dato)
        localStorage.setItem('adminSesion', JSON.stringify(dato));
        this.router.navigate(['/dashboardAdmin']);
        },
          error: (err) =>{
          alert("error al iniciar: " + err.error)
          console.error(err)
      }
    })
  }
  
}