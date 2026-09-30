import { Component, OnInit, ChangeDetectorRef, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnviarDatoServicio } from '../servicios/enviar-dato-servicio';
import { ServiciosTipoVehiculo } from '../servicios/servicios-tipo-vehiculo';
import { TipoVehiculo } from '../entidades/tipo-vehiculo';
import { Navegacion } from '../navegacion/navegacion'; // <-- Conservamos este import limpio

@Component({
  selector: 'app-tipo-vehiculos',
  imports: [CommonModule, FormsModule, Navegacion], // <-- CORRECCIÓN: Agrega Navegacion aquí para que el HTML reconozca <app-navegacion>
  templateUrl: './tipo-vehiculos.html',
  styleUrls: ['./tipo-vehiculos.css']
})
export class TipoVehiculosComponent implements OnInit {

  listaTV = signal<TipoVehiculo[]>([]);
  bandera: boolean = false; 
  busqueda: string = ""; 
  idTV: number | null = null;
  nombreTV: string = "";

  private dataService = inject(EnviarDatoServicio);

  ngOnInit(): void {
    this.listar();
  }

  tipoVehiculo: TipoVehiculo = new TipoVehiculo;
  constructor(private servicio: ServiciosTipoVehiculo, private cdr: ChangeDetectorRef) { }

  listar() {
    this.servicio.listarTipoVehiculo().subscribe(dato => {
      this.listaTV.set(dato);
      console.log(dato);
      this.cdr.markForCheck();
    });
  }

  abrirModal() {
    const modal = document.getElementById("registro");
    if (modal != null) {
      modal.style.display = 'block';
    }
  }

  cerrarModal() {
    this.tipoVehiculo = new TipoVehiculo;
    this.bandera = false;
    const modal = document.getElementById("registro");
    if (modal != null) {
      modal.style.display = 'none';
    }
  }

  guardar() {
    this.servicio.guardarTipoVehiculo(this.tipoVehiculo).subscribe(dato => {
      console.log(dato)
      this.cerrarModal()
      this.listar();
      this.enviarTipoVehiculo(dato);
    })
  }

  actualizar(t: TipoVehiculo) {
    this.bandera = true; 
    this.nombreTV = t.nombre;
    this.tipoVehiculo = { ...t };
    this.abrirModal();
  }


  eliminar(id_tipo_vehiculo: number) {
    const confirmar = confirm(`Estas seguro de eliminar el tipo de vehiculo # ${id_tipo_vehiculo}?`)
    if (confirmar) {
      this.servicio.eliminarTipoVehiculo(id_tipo_vehiculo).subscribe(dato => {
        console.log(dato)
        this.listar();
        alert("Eliminado con éxito");
      });
    }
  }

  verId() {
    if (this.idTV === null || this.idTV === undefined || this.idTV <= 0) {
      console.warn('Por favor ingrese un id.');
      alert('Por favor ingrese un id valido.')
      return;
    }

    this.servicio.buscarTipoVehiculo(this.idTV).subscribe({
      next: (dato) => {
        console.log('Vehiculos encontrados:', dato);
        this.listaTV.set([dato]);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al consultar vehiculos:', err);
        alert('No se encontro ningun vehiculo.');
      }
    });
    this.cdr.markForCheck();
  }

  verNombre() {
    if (!this.nombreTV.trim()) {
      console.warn('Por favor ingrese un nombre.');
      return;
    }

    this.servicio.buscarNombre(this.nombreTV).subscribe({
      next: (dato) => {
        console.log('Vehiculos encontrados:', dato);
        this.listaTV.set(dato); 
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al consultar vehiculos:', err);
        alert('No se encontro ningun vehiculo.');
      }
    });
    this.cdr.markForCheck();
  }

  enviarTipoVehiculo(t: TipoVehiculo) {
    console.log(t);
    this.dataService.enviar(t);
    alert(`Tipo de Vehiculo "${t.nombre}" enviado correctamente.`);
    this.cerrarModal();
  }

  paginaActual = signal(1);
  itemsPorPagina = 2;


  datosPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.listaTV().slice(inicio, fin);
  });

  totalPaginas = computed(() =>
    Math.ceil(this.listaTV().length / this.itemsPorPagina));

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas()) {
      this.paginaActual.set(nuevaPagina);
    }
  }

}
