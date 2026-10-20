import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { Alquileres } from '../entidades/alquileres';
import { AlquilerServicio } from '../servicios/alquiler-servicio';
import { NavAdminComponente } from '../nav-admin-componente/nav-admin-componente';

@Component({
  selector: 'app-historial-alquileres',
  imports: [CommonModule, NavAdminComponente],
  templateUrl: './historial-alquileres.html',
  styleUrl: './historial-alquileres.css',
})
export class HistorialAlquileres implements OnInit {
  historialAlquileres = signal<Alquileres[]>([]);
  paginaActual = signal(1);
  cargando = signal(true);
  errorCarga = signal(false);
  readonly itemsPorPagina = 10;

  datosPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.itemsPorPagina;
    return this.historialAlquileres().slice(inicio, inicio + this.itemsPorPagina);
  });

  totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.historialAlquileres().length / this.itemsPorPagina)),
  );

  subtotal = computed(() =>
    this.historialAlquileres().reduce((total, alquiler) => total + Number(alquiler.valorTotal || 0), 0),
  );

  constructor(private readonly alquilerServicio: AlquilerServicio) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.cargando.set(true);
    this.errorCarga.set(false);
    this.alquilerServicio.listarHistorialCompleto().subscribe({
      next: (datos) => {
        this.historialAlquileres.set(datos ?? []);
        this.paginaActual.set(1);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar el historial de alquileres:', err);
        this.errorCarga.set(true);
        this.cargando.set(false);
      },
    });
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas()) {
      this.paginaActual.set(nuevaPagina);
    }
  }
}
