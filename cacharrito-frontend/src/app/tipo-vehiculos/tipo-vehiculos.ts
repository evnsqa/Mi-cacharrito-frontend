import { Component, OnInit, ChangeDetectorRef, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnviarDatoServicio } from '../servicios/enviar-dato-servicio';
import { ServiciosTipoVehiculo } from '../servicios/servicios-tipo-vehiculo';
import { TipoVehiculo } from '../entidades/tipo-vehiculo';
import { NavAdminComponente } from '../nav-admin-componente/nav-admin-componente';

@Component({
  selector: 'app-tipo-vehiculos',
  imports: [CommonModule, FormsModule, NavAdminComponente],
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
      this.paginaActual.set(1);
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


  eliminar(idTipoVehiculo: number) {
    const confirmar = confirm(`¿Estás seguro de eliminar el tipo de vehículo # ${idTipoVehiculo}?`);
    
    if (confirmar) {
      this.servicio.eliminarTipoVehiculo(idTipoVehiculo).subscribe({
        next: (dato) => {
          console.log('Borrado exitoso (JSON):', dato);
          this.listar();
          alert("Tipo de Vehículo eliminado con éxito.");
        },
        error: (err) => {
          console.error('Error capturado al borrar:', err);

          if (err.status === 200) {
            this.listar(); 
            alert("Tipo de Vehículo y sus automóviles asociados eliminados con éxito.");
          } 
          else if (err.status === 400) {
            alert(err.error); 
          } 
          else {
            alert("Ocurrió un error inesperado al conectar con el servidor.");
          }
        }
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
        this.paginaActual.set(1);
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
        this.paginaActual.set(1);
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
    alert(`Tipo de Vehiculo "${t.nombre}" guardado correctamente.`);
    this.cerrarModal();
  }

  paginaActual = signal(1);
  itemsPorPagina = 5;


  datosPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.listaTV().slice(inicio, fin);
  });

  totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.listaTV().length / this.itemsPorPagina)));

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= Math.max(1, this.totalPaginas())) {
      this.paginaActual.set(nuevaPagina);
    }
  }

}
