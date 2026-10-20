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

  readonly fechaHoy = this.fechaLocal(new Date());
  constructor(private servicioUsuario: UsuarioServicio, private router: Router){}
  usuarioNuevo: Usuario = new Usuario;

  limitarDigitos(evento: Event, campo: 'idUsuario' | 'telefono'): void {
    const input = evento.target as HTMLInputElement;
    const valor = input.value.replace(/\D/g, '').slice(0, 10);
    input.value = valor;
    this.usuarioNuevo[campo] = valor;
  }

  get fechaMinimaVigencia(): string {
    const expedicion = this.usuarioNuevo.fechaExpedicionLicencia;
    return expedicion && expedicion > this.fechaHoy ? expedicion : this.fechaHoy;
  }

  registrar() {
    const { fechaExpedicionLicencia, vigenciaLicencia } = this.usuarioNuevo;
    if (!fechaExpedicionLicencia || !vigenciaLicencia) {
      alert('Ingresa las fechas de expedición y vencimiento de la licencia.');
      return;
    }
    if (fechaExpedicionLicencia > this.fechaHoy) {
      alert('La fecha de expedición no puede ser posterior a hoy.');
      return;
    }
    if (vigenciaLicencia < fechaExpedicionLicencia) {
      alert('La fecha de inicio de la licencia no puede ser posterior a la fecha de vencimiento.');
      return;
    }
    if (vigenciaLicencia < this.fechaHoy) {
      alert('No puedes registrarte con una licencia vencida.');
      return;
    }
    this.servicioUsuario.registroUsuario(this.usuarioNuevo).subscribe({
      next: (dato) => {
        console.log(dato);
        alert("Registro exitoso");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const mensaje = typeof err.error === 'string'
          ? err.error
          : err.error?.mensaje ?? 'Error al registrar. Revisa los campos e inténtalo de nuevo.';
        alert(mensaje);
        console.error(err);
      }
    });
  }

  private fechaLocal(fecha: Date): string {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
  }

}
