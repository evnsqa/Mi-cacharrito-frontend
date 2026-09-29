import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavAdminComponente } from '../nav-admin-componente/nav-admin-componente';
import { FormsModule } from '@angular/forms';
import { AlquilerServicio } from '../servicios/alquiler-servicio';
import { Alquileres } from '../entidades/alquileres';

@Component({
  imports: [CommonModule, NavAdminComponente, FormsModule],
  selector: 'app-entregar-vehiculo-componente',
  styleUrl: './entrega-vehiculo-componente.css',
  templateUrl: './entrega-vehiculo-componente.html',
})
export class EntregarVehiculoComponente implements OnInit {
  
  alquileresPendientes = signal<Alquileres[]>([]);
  paginaActual = signal(1);
  itemsPorPagina = 10;

  placaBuscada = '';

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
    this.cargarAlquileres();
  }

  cargarAlquileres(): void {
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

  buscarPorPlaca():void {
    const placa = this.placaBuscada.trim().toLowerCase();

    if (placa === '') {
      this.cargarAlquileres();
      return;

  }

  const resultados = this.alquileresPendientes().filter(
    alquiler => alquiler.vehiculos?.placa?.toLowerCase() === placa
    );

    this.alquileresPendientes.set(resultados);
    this.paginaActual.set(1);
  }


  entregarVehiculo(placa: string): void {

    const confirmar = confirm(
      '¿Está seguro de que desea entregar este vehículo?'
    );

    if (confirmar) {
      this.alquilerServicio.entregarVehiculo(placa).subscribe({
        next: () => {
          alert('Vehículo entregado correctamente');
          this.cargarAlquileres();

        },

        error: (err) => {
          alert('Error al entregar el vehículo');
          console.error(err);

        }

      });

    }

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