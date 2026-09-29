import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <-- 1. Importamos el detector de cambios
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiciosTipoVehiculo } from '../servicios/servicios-tipo-vehiculo';
import { TipoVehiculo } from '../entidades/tipo-vehiculo';
import { Navegacion } from '../navegacion/navegacion';

@Component({
  selector: 'app-tipo-vehiculos',
  imports: [CommonModule, FormsModule,Navegacion],
  templateUrl: './tipo-vehiculos.html',
  styleUrls: ['./tipo-vehiculos.css']
})
export class TipoVehiculosComponent implements OnInit {

  listaTipos: any[] = [];
  listaTiposOriginal: any[] = [];
  tipoActual: any = { idTipo: null, nombre: '' };
  
  bandera: boolean = false; 
  busqueda: string = ''; 
  textoBusqueda: string = '';

  constructor(private servicio: ServiciosTipoVehiculo, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.servicio.listarTodos().subscribe(datos => {
      this.listaTipos = datos;
      this.listaTiposOriginal = datos;
      
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
    this.tipoActual = { idTipo: null, nombre: '' };
    this.bandera = false;
    const modal = document.getElementById("registro");
    if (modal != null) {
      modal.style.display = 'none';
    }
  }

  guardar() {
    if (this.tipoActual.idTipo || this.tipoActual.idTipoVehiculo) {
      this.servicio.modificar(this.tipoActual).subscribe(() => {
        alert("Modificado con éxito");
        this.cerrarModal();
        this.listar(); 
      });
    } else {
      this.servicio.guardar(this.tipoActual).subscribe(() => {
        alert("Guardado con éxito");
        this.cerrarModal();
        this.listar();
      });
    }
  }

  actualizar(tipo: any) {
    this.bandera = true; 
    this.tipoActual = { ...tipo }; 
    this.abrirModal();
  }

  eliminar(id: any) {
    if (confirm('¿Estás seguro de eliminar este tipo de vehículo?')) {
      this.servicio.eliminar(id).subscribe(() => {
        alert("Eliminado con éxito");
        this.listar(); 
      });
    }
  }

  buscar() {
    if (!this.textoBusqueda.trim()) {
      this.listaTipos = this.listaTiposOriginal;
      this.cdr.detectChanges();
      return;
    }
    this.listaTipos = this.listaTiposOriginal.filter((t: any) => 
      t.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase())
    );
    this.cdr.detectChanges();
  }

  limpiarBusqueda() {
    this.textoBusqueda = '';
    this.listaTipos = this.listaTiposOriginal;
    this.cdr.detectChanges();
  }
}