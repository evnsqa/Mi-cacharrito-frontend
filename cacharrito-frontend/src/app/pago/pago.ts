import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Alquileres } from '../entidades/alquileres';
import { AlquilerServicio } from '../servicios/alquiler-servicio';
import { Navegacion } from '../navegacion/navegacion';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navegacion],
  templateUrl: './pago.html',
  styleUrl: './pago.css',
})
export class PagoComponente implements OnInit {
  alquiler: Alquileres | null = null;
  idAlquiler = 0;
  cargando = true;
  procesando = false;
  resultado: 'exito' | 'error' | null = null;
  mensajeResultado = '';

  titular = '';
  numeroTarjeta = '';
  vencimiento = '';
  codigoSeguridad = '';

  constructor(
    private route: ActivatedRoute,
    private alquilerServicio: AlquilerServicio,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.idAlquiler = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(this.idAlquiler) || this.idAlquiler <= 0) {
      this.cargando = false;
      this.resultado = 'error';
      this.mensajeResultado = 'El enlace de pago no contiene un número de alquiler válido.';
      return;
    }

    this.cargarAlquiler();
  }

  cargarAlquiler(): void {
    this.cargando = true;
    this.alquiler = null;
    this.resultado = null;
    this.mensajeResultado = '';
    this.alquilerServicio.buscarAlquiler(this.idAlquiler).subscribe({
      next: (alquiler) => {
        this.alquiler = alquiler;
        this.cargando = false;
        if (alquiler.estado?.toLowerCase() !== 'pendiente de pago') {
          this.resultado = 'error';
          this.mensajeResultado = alquiler.pagado
            ? 'Este alquiler ya fue pagado.'
            : 'Este alquiler todavía no está aprobado para el pago.';
        }
        this.changeDetector.markForCheck();
      },
      error: (err) => {
        this.cargando = false;
        this.resultado = 'error';
        if (err.name === 'TimeoutError') {
          this.mensajeResultado = 'El backend no respondió en 15 segundos. Verifica que Spring Boot esté activo en localhost:8080 y que MySQL esté conectado.';
        } else if (err.status === 0) {
          this.mensajeResultado = 'No hay conexión con el backend. Inicia Spring Boot en localhost:8080 y vuelve a intentar.';
        } else if (err.status === 404) {
          this.mensajeResultado = `No se encontró el alquiler #${this.idAlquiler}. Revisa que el número sea correcto.`;
        } else {
          this.mensajeResultado = err.error?.mensaje ?? 'No se pudo cargar el alquiler. Revisa el backend e inténtalo de nuevo.';
        }
        this.changeDetector.markForCheck();
      },
    });
  }

  procesarPago(): void {
    if (!this.alquiler || this.procesando || !this.formularioValido()) return;


    if (this.numeroTarjeta.replace(/\s/g, '') === '4000000000000002') {
      this.resultado = 'error';
      this.mensajeResultado = 'El pago de prueba fue rechazado. Revisa los datos o usa otra tarjeta de prueba.';
      return;
    }

    this.procesando = true;
    this.resultado = null;
    this.alquilerServicio.pagarAlquiler(this.idAlquiler).subscribe({
      next: (alquilerPagado) => {
        this.alquiler = alquilerPagado;
        this.resultado = 'exito';
        this.mensajeResultado = 'Pago de prueba aprobado. Tu alquiler quedó pendiente de entrega.';
        this.limpiarDatosTarjeta();
        this.procesando = false;
        this.changeDetector.markForCheck();
      },
      error: (err) => {
        this.resultado = 'error';
        this.mensajeResultado = err.error?.mensaje ?? err.error ?? 'No se pudo completar el pago. Inténtalo de nuevo.';
        this.procesando = false;
        this.changeDetector.markForCheck();
      },
    });
  }

  formularioValido(): boolean {
    const numero = this.numeroTarjeta.replace(/\s/g, '');
    const fecha = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(this.vencimiento);
    if (!this.titular.trim() || !this.pasaLuhn(numero) || !fecha || !/^\d{3,4}$/.test(this.codigoSeguridad)) return false;

    const mes = Number(fecha[1]);
    const anio = 2000 + Number(fecha[2]);
    const hoy = new Date();
    return anio > hoy.getFullYear() || (anio === hoy.getFullYear() && mes >= hoy.getMonth() + 1);
  }

  private pasaLuhn(numero: string): boolean {
    if (!/^\d{13,19}$/.test(numero)) return false;
    let suma = 0;
    let duplicar = false;
    for (let i = numero.length - 1; i >= 0; i--) {
      let digito = Number(numero[i]);
      if (duplicar) {
        digito *= 2;
        if (digito > 9) digito -= 9;
      }
      suma += digito;
      duplicar = !duplicar;
    }
    return suma % 10 === 0;
  }

  private limpiarDatosTarjeta(): void {
    this.numeroTarjeta = '';
    this.vencimiento = '';
    this.codigoSeguridad = '';
  }
}
