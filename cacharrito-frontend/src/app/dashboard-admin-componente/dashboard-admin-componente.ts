import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavAdminComponente } from '../nav-admin-componente/nav-admin-componente';
import { AlquilerServicio } from '../servicios/alquiler-servicio';
import { Alquileres } from '../entidades/alquileres';
import { Vehiculo } from '../entidades/vehiculo';
import { VehiculoServicio } from '../servicios/vehiculo-servicio';
@Component({
  imports: [NavAdminComponente, CommonModule],
  selector: 'app-dashboard-admin-componente',
  styleUrl: './dashboard-admin-componente.css',
  templateUrl: './dashboard-admin-componente.html',
})

export class DashboardAdminComponente implements OnInit {

  alquileresPendientes = signal<Alquileres[]>([]);
  vehiculosDisponibles = signal(0);
  aceptando = signal<number | null>(null);
  
  paginaActual = signal(1);
  itemsPorPagina = 10;
  datosPaginados = computed(() => {

    const inicio = (this.paginaActual() - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;

    return this.alquileresPendientes().slice(inicio, fin);

  });

  totalPaginas = computed(() =>
    Math.ceil(
      this.alquileresPendientes().length / this.itemsPorPagina
    )
  );

  constructor(
    private alquilerServicio: AlquilerServicio,
    private vehiculoServicio: VehiculoServicio,
  ) {}
  ngOnInit(): void {
    this.cargarVehiculosDisponibles();
    this.alquilerServicio.listarAlquileresPendientes().subscribe({
      next: (datos) => {
        this.alquileresPendientes.set(datos);
      },

      error: (err) => {

        console.error(
          'Error al cargar los alquileres pendientes:',
          err
        );
      }
    });
  }

  private cargarVehiculosDisponibles(): void {
    this.vehiculoServicio.listarVehiculo().subscribe({
      next: (vehiculos: Vehiculo[]) => {
        this.vehiculosDisponibles.set(
          vehiculos.filter(v => v.estado?.trim().toLocaleLowerCase() === 'disponible').length,
        );
      },
      error: (err) => console.error('Error al cargar los vehículos disponibles:', err),
    });
  }

  cambiarPagina(nuevaPagina: number) {
    if (
      nuevaPagina >= 1 &&
      nuevaPagina <= this.totalPaginas()
    ) {
      this.paginaActual.set(nuevaPagina);
    }
  }

  aceptarAlquiler(alquiler: Alquileres): void {
    const id = alquiler.numeroAlquiler;
    if (!confirm(`¿Deseas aprobar el alquiler #${id}? Se enviará un correo al cliente.`)) return;

    this.aceptando.set(id);
    this.alquilerServicio.aceptarAlquiler(id).subscribe({
      next: (resultado) => {
        this.alquileresPendientes.update(lista => lista.filter(item => item.numeroAlquiler !== id));
        if (this.paginaActual() > this.totalPaginas() && this.totalPaginas() > 0) {
          this.paginaActual.set(this.totalPaginas());
        }
        alert(resultado.correoEnviado
          ? 'Solicitud aprobada. Se envió el enlace de pago al correo del cliente.'
          : 'Solicitud aprobada, pero no se pudo enviar el correo. Revisa la configuración SMTP del backend. El cliente también podrá pagar desde “Mis alquileres”.');
        this.aceptando.set(null);
      },
      error: (err) => {
        alert(err.error?.mensaje ?? err.error ?? 'No se pudo aprobar el alquiler.');
        console.error('Error al aprobar el alquiler:', err);
        this.aceptando.set(null);
      },
    });
  }

  rechazarSolicitud(alquiler: Alquileres): void {
    const id = alquiler.numeroAlquiler;
    if (!confirm(`¿Rechazar el alquiler #${id}? Se cancelará, se guardará en el historial y se notificará al cliente por correo.`)) return;
    this.aceptando.set(id);
    this.alquilerServicio.rechazarAlquiler(id).subscribe({
      next: (resultado) => {
        this.alquileresPendientes.update(lista => lista.filter(item => item.numeroAlquiler !== id));
        if (this.paginaActual() > this.totalPaginas() && this.totalPaginas() > 0) this.paginaActual.set(this.totalPaginas());
        alert(resultado.correoEnviado
          ? 'Solicitud rechazada y cliente notificado por correo.'
          : 'La solicitud quedó cancelada y pasó al historial, pero no se pudo enviar el correo. Revisa la configuración SMTP.');
        this.aceptando.set(null);
      },
      error: (err) => {
        alert(err.error?.mensaje ?? err.error ?? 'No se pudo rechazar el alquiler.');
        console.error('Error al rechazar el alquiler:', err);
        this.aceptando.set(null);
      },
    });
  }
}
