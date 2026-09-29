import { Component, OnInit, signal, computed } from '@angular/core';
import { NavAdminComponente } from '../nav-admin-componente/nav-admin-componente';
import { AlquilerServicio } from '../servicios/alquiler-servicio';
import { Alquileres } from '../entidades/alquileres';
@Component({
  imports: [NavAdminComponente],
  selector: 'app-dashboard-admin-componente',
  styleUrl: './dashboard-admin-componente.css',
  templateUrl: './dashboard-admin-componente.html',
})

export class DashboardAdminComponente implements OnInit {

  alquileresPendientes = signal<Alquileres[]>([]);
  
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

  constructor(private alquilerServicio: AlquilerServicio) {}
  ngOnInit(): void {
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

  cambiarPagina(nuevaPagina: number) {
    if (
      nuevaPagina >= 1 &&
      nuevaPagina <= this.totalPaginas()
    ) {
      this.paginaActual.set(nuevaPagina);
    }
  }
}