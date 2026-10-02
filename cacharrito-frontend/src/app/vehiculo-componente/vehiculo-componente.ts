import { Component, OnInit, ChangeDetectorRef, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehiculo } from '../entidades/vehiculo';
import { VehiculoServicio } from '../servicios/vehiculo-servicio';
import { EnviarDatoServicio } from '../servicios/enviar-dato-servicio';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  imports: [CommonModule],
  selector: 'app-vehiculo-componente',
  styleUrl: './vehiculo-componente.css',
  templateUrl: './vehiculo-componente.html',
})
export class VehiculoComponente implements OnInit {
  listaVehiculos = signal<Vehiculo[]>([]);
  vehiculoSeleccionado: Vehiculo | null = null;

  private dataService = inject(EnviarDatoServicio);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const tipoVehiculo = params.get('tipo');
      if (tipoVehiculo) {
        this.cargarVehiculosPorTipo(tipoVehiculo);
      }
    });
  }

  constructor(private servicioVehiculo: VehiculoServicio, private cdr: ChangeDetectorRef) { }

  cargarVehiculosPorTipo(tipo: string) {
    this.servicioVehiculo.buscarPorTipoEstado(tipo).subscribe({
      next: (dato) => {
        console.log('Vehiculos disponibles recibidos:', dato);
        this.listaVehiculos.set(dato);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar vehiculos disponibles:', err);
      }
    });
  }

  explorarVehiculo(v: Vehiculo) {
    this.vehiculoSeleccionado = v;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.abrirModal();
    }, 10);
  }

  abrirModal() {
    const modal = document.getElementById("explorador");
    if (modal != null) {
      modal.style.display = 'block';
    }
  }

  cerrarModal() {
    const modal = document.getElementById("explorador");
    if (modal != null) {
      modal.style.display = 'none';
    }
    this.vehiculoSeleccionado = null;
  }

  enviarSeleccionado(v: Vehiculo) {
    console.log(v);
    this.dataService.enviar(v);
    alert(`Vehiculo "${v.nombre}" seleccionado correctamente.`);
    this.cerrarModal();
    this.router.navigate(['/alquiler']);
  }
}