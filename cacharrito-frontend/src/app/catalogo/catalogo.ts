import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServiciosTipoVehiculo } from '../servicios/servicios-tipo-vehiculo';
import { Navegacion } from '../navegacion/navegacion';
import { TipoVehiculo } from '../entidades/tipo-vehiculo';

@Component({
  selector: 'app-catalogo',
  imports: [CommonModule, Navegacion],
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.css']
})
export class CatalogoComponent implements OnInit {

  listaTipoVehiculos = signal<TipoVehiculo[]>([]);

  constructor(private servicio: ServiciosTipoVehiculo, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listar();
  }

  irAVehiculos(tipoVehiculo: any) {
    this.router.navigate(['/vehiculos-por', tipoVehiculo.nombre]);
  }

  listar() {
    this.servicio.listarTipoVehiculo().subscribe({
      next: (dato: any) => {
        console.log('Tipos de Vehiculos:', dato);
        this.listaTipoVehiculos.set(dato);
        this.cdr.markForCheck();
      },
      error: (err) => {
        alert("Atención: El servidor de Java (Eclipse) está apagado o desconectado.");
      }
    });
  }


}