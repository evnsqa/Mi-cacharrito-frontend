import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlquilerServicio } from '../servicios/alquiler-servicio';
import { Navegacion } from '../navegacion/navegacion';

@Component({
  imports: [CommonModule, Navegacion],
  selector: 'app-cancelar-alquiler-componente',
  styleUrl: './cancelar-alquiler-componente.css',
  templateUrl: './cancelar-alquiler-componente.html',
})
export class CancelarAlquilerComponente implements OnInit {

  alquileres = signal<any[]>([]);

  paginaActual = signal(1);

  itemsPorPagina = 10;

  datosPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;

    return this.alquileres().slice(inicio, fin);
  });

  totalPaginas = computed(() =>
    Math.ceil(this.alquileres().length / this.itemsPorPagina)
  );

  constructor(private alquilerServicio: AlquilerServicio) {}

  ngOnInit(): void {

    const usuarioString = localStorage.getItem('usuarioSesion');

    if (usuarioString) {

      const usuario = JSON.parse(usuarioString);

      this.alquilerServicio.listarAlquileresPorUsuario(usuario.id).subscribe({

        next: (datos) => {
          this.alquileres.set(datos);
        },

        error: (err) => {
          console.error('Error al cargar los alquileres:', err);
        }

      });

    }
  }

  cambiarPagina(nuevaPagina: number) {

    if (
      nuevaPagina >= 1 &&
      nuevaPagina <= this.totalPaginas()
    ) {

      this.paginaActual.set(nuevaPagina);

    }

  }

  cancelarAlquiler(numeroAlquiler: number) {

    const confirmar = confirm(
      '¿Está seguro de que desea cancelar este alquiler?'
    );

    if (confirmar) {

      this.alquilerServicio.cancelarAlquiler(numeroAlquiler).subscribe({

        next: () => {

          alert('Alquiler cancelado correctamente');

          this.alquileres.update(lista =>
            lista.filter(alquiler =>
              alquiler.numeroAlquiler !== numeroAlquiler
            )
          );

          if (
            this.paginaActual() > this.totalPaginas() &&
            this.totalPaginas() > 0
          ) {

            this.paginaActual.set(this.totalPaginas());

          }

        },

        error: (err) => {

          alert('Error al cancelar el alquiler');
          console.error(err);

        }

      });

    }

  }

}