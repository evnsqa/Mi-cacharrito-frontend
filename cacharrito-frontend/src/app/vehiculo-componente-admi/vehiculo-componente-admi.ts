import { Component, OnInit, ChangeDetectorRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vehiculo } from '../entidades/vehiculo';
import { TipoVehiculo } from '../entidades/tipo-vehiculo';
import { VehiculoServicio } from '../servicios/vehiculo-servicio';
import { Navegacion } from '../navegacion/navegacion';

@Component({
  imports: [CommonModule, FormsModule, Navegacion],
  selector: 'app-vehiculo-componente-admi',
  styleUrl: './vehiculo-componente-admi.css',
  templateUrl: './vehiculo-componente-admi.html',
})
export class VehiculoComponenteAdmi implements OnInit {

  listaV = signal<Vehiculo[]>([]);
  tipoVehiculos: TipoVehiculo[] = [];
  bandera: boolean = false;
  placaV: string = "";
  nombreV: string = "";
  nombreT: string = "";
  precioV: number | null = null;
  estadoV: string = "";
  busqueda: string = ""; 

  ngOnInit(): void {
    this.listarVehiculos();
    this.listarTipoVehiculo();
    this.cargarImagen;
  }

  vehiculo: Vehiculo = new Vehiculo;
  constructor(private servicioVehiculo: VehiculoServicio, private cdr: ChangeDetectorRef) { }

  listarVehiculos() {

    this.servicioVehiculo.listarVehiculo().subscribe(dato => {
      this.listaV.set(dato)
      console.log(dato);
      this.cdr.markForCheck();
    });
  }

  abrirModal() {
    const modal = document.getElementById("registro")
    if (modal != null) {
      modal.style.display = 'block';
    }
  }

  cerrarModal() {
    this.vehiculo = new Vehiculo;
    this.bandera = false;
    const modal = document.getElementById("registro")
    if (modal != null) {
      modal.style.display = 'none';
    }
  }

  eliminar(placa: string) {
    const confirmar = confirm(`Estas seguro de eliminar el vehiculo: ${placa}?`)

    if (confirmar) {
      this.servicioVehiculo.eliminarVehiculo(placa).subscribe(dato => {
        console.log(dato)
        this.listarVehiculos()
        alert('Vehiculo eliminado correctamente.')
      })
    }
  }


  actualizar(v: Vehiculo) {
    this.bandera = true;
    this.placaV = v.placa;
    this.vehiculo = { ...v };
    this.abrirModal();
  }


  guardarVehiculo() {
    this.servicioVehiculo.guardarVehiculo(this.vehiculo, this.placaV).subscribe({

      next: (dato) => {
        console.log('Vehículo guardado con éxito:', dato);
        this.cerrarModal();
        this.listarVehiculos();
        alert('Vehículo guardado correctamente.');
      },

      error: (err) => {
        console.error('Error capturado desde Eclipse:', err);

        if (err.status === 400) {
          alert(err.error); 
        } else {
          alert('No se pudo guardar el vehículo. Por favor, intente nuevamente.');
        }
      }
    });
  }



  verPlaca() {
    if (!this.placaV.trim()) {
      console.warn('Por favor ingrese una placa.');
      return;
    }

    this.servicioVehiculo.buscarPlaca(this.placaV).subscribe({
      next: (dato) => {
        console.log('Vehiculos encontrados:', dato);
        this.listaV.set([dato]);
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
    if (!this.nombreV.trim()) {
      console.warn('Por favor ingrese un nombre.');
      return;
    }

    this.servicioVehiculo.buscarNombre(this.nombreV).subscribe({
      next: (dato) => {
        console.log('Vehiculos encontrados:', dato);
        this.listaV.set(dato); 
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al consultar vehiculos:', err);
        alert('No se encontro ningun vehiculo.');
      }
    });
    this.cdr.markForCheck();
  }

  listarTipoVehiculo() {
    this.servicioVehiculo.listarTipoVehiculos().subscribe(dato => {
      console.log(dato);
      this.tipoVehiculos = dato;
      this.cdr.markForCheck();
    });
  }


  verTipoVehiculo() {
    if (!this.nombreT.trim()) {
      console.warn('Por favor seleccione un tipo.');
      return;
    }

    this.servicioVehiculo.buscarTipo(this.nombreT).subscribe({
      next: (dato) => {
        console.log('Vehiculos encontrados:', dato);
        this.listaV.set(dato); 
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al consultar vehiculos:', err);
        alert('No se encontro ningun vehiculo.');
      }
    });
    this.cdr.markForCheck();
  }


  verPrecio() {
    if (this.precioV === null || this.precioV === undefined || this.precioV <= 0) {
      console.warn('Por favor ingrese un precio.');
      alert('Por favor ingrese un precio valido.')
      return;
    }

    this.servicioVehiculo.buscarPrecio(this.precioV).subscribe({
      next: (dato) => {
        console.log('Vehiculos encontrados:', dato);
        this.listaV.set(dato); 
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al consultar vehiculos:', err);
        alert('No se encontro ningun vehiculo.');
      }
    });
    this.cdr.markForCheck();
  }


  verEstado() {
    if (!this.estadoV.trim()) {
      console.warn('Por favor ingrese un estado.');
      return;
    }

    this.servicioVehiculo.buscarEstado(this.estadoV).subscribe({
      next: (dato) => {
        console.log('Vehiculos encontrados:', dato);
        this.listaV.set(dato); 
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al consultar vehiculos:', err);
        alert('No se encontro ningun vehiculo.');
      }
    });
    this.cdr.markForCheck();
  }


  paginaActual = signal(1);
  itemsPorPagina = 10;


  datosPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.listaV().slice(inicio, fin);
  });

  totalPaginas = computed(() =>
    Math.ceil(this.listaV().length / this.itemsPorPagina));

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas()) {
      this.paginaActual.set(nuevaPagina);
    }
  }


  cargarImagen(event: any) {
    const archivo = event.target.files?.[0];
    
    if (archivo) {
      const lector = new FileReader();
      
      lector.onload = () => {
        this.vehiculo.imagen = lector.result as string;
        this.cdr.markForCheck();
      };
      
      lector.readAsDataURL(archivo);
    }
  }

}
