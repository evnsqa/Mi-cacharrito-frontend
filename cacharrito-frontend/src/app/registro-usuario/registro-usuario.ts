import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../entidades/usuario';
import { UsuarioServicio } from '../servicios/usuario-servicio';
import { Navegacion } from '../navegacion/navegacion';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [FormsModule, Navegacion, RouterLink],
  selector: 'app-registro-usuario',
  styleUrl: './registro-usuario.css',
  templateUrl: './registro-usuario.html',
})
export class RegistroUsuario {

  constructor(private servicioUsuario: UsuarioServicio, private router: Router){}
  usuarioNuevo: Usuario = new Usuario;

  registrar() {
    this.servicioUsuario.registroUsuario(this.usuarioNuevo).subscribe({
      next: (dato) => {
        console.log(dato);
        alert("Registro exitoso");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert("Error al registrar, llene todos los campos correctamente.");
        console.error(err);
      }
    });
  }

}
