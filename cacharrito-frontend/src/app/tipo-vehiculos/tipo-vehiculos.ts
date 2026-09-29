import { Component, OnInit, ChangeDetectorRef, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiciosTipoVehiculo } from '../servicios/servicios-tipo-vehiculo';
import { TipoVehiculo } from '../entidades/tipo-vehiculo';
import { EnviarDatoServicio } from '../servicios/enviar-dato-servicio';

@Component({
  selector: 'app-tipo-vehiculos',
  imports: [CommonModule, FormsModule],
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