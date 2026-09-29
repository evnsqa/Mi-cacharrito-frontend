
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Alquileres } from '../entidades/alquileres';
import { NavAdminComponente } from '../nav-admin-componente/nav-admin-componente';
import { AlquilerServicio } from '../servicios/alquiler-servicio';

@Component({
  imports: [CommonModule, NavAdminComponente],
  selector: 'app-devoluciones-componente',
  styleUrl: './devoluciones-componente.css',
  templateUrl: './devoluciones-componente.html',
})

export class DevolucionesComponente implements OnInit {
  
  alquileresEntregados = signal<Alquileres[]>([]);

  paginaActual = signal(1);
  itemsPorPagina = 10;
  datosPaginados = computed(() => {
    const inicio =
      (this.paginaActual() - 1) * this.itemsPorPagina;

    const fin =
      inicio + this.itemsPorPagina;

    return this.alquileresEntregados().slice(inicio, fin);

  });

  totalPaginas = computed(() =>
    Math.max(
      1,
      Math.ceil(
        this.alquileresEntregados().length /
        this.itemsPorPagina
      )
    )
  );

  constructor(
    private alquilerServicio: AlquilerServicio
  ) {}

  ngOnInit(): void {
    this.cargarAlquileres();
  }

  cargarAlquileres(): void {

    this.alquilerServicio
      .listarAlquileresEntregados()
      .subscribe({

        next: (datos) => {
          this.alquileresEntregados.set(datos);
        },

        error: (err) => {

          console.error(
            'Error al cargar los alquileres entregados:',
            err
          );
        }
      });
  }

  devolverVehiculo(id: number): void {

    const confirmar = confirm(
      '¿Está seguro de que desea devolver este vehículo?'
    );

    if (!confirmar) {
      return;
    }

    this.alquilerServicio.devolverVehiculo(id).subscribe({
      next: () => {
        alert('Vehículo devuelto correctamente');
        this.cargarAlquileres();
      },
      error: (err) => {
        alert('Error al devolver el vehículo');
        console.error(err);
      }
    });
}
  cambiarPagina(nuevaPagina: number): void {
    if (
      nuevaPagina >= 1 &&
      nuevaPagina <= this.totalPaginas()
    ) {

      this.paginaActual.set(nuevaPagina);
    }
  }
}