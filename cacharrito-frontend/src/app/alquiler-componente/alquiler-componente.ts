import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Alquileres } from '../entidades/alquileres';
import { AlquilerServicio } from '../servicios/alquiler-servicio';
import { EnviarDatoServicio } from '../servicios/enviar-dato-servicio';
import { Navegacion } from '../navegacion/navegacion';

@Component({
  imports: [FormsModule, Navegacion],
  selector: 'app-alquiler',
  styleUrl: './alquiler-componente.css',
  templateUrl: './alquiler-componente.html',
})
export class AlquilerComponente implements OnInit {
  nuevoAlquiler: Alquileres = new Alquileres();
  private readonly hoy = new Date();
  fechaMinima = `${this.hoy.getFullYear()}-${String(this.hoy.getMonth() + 1).padStart(2, '0')}-${String(this.hoy.getDate()).padStart(2, '0')}`;

  constructor(
    private alquilerServicio: AlquilerServicio,
    private router: Router,
    private dataService: EnviarDatoServicio,
  ) {}

  ngOnInit(): void {
    const usuarioString = localStorage.getItem('usuarioSesion');
    if (usuarioString) {
      try {
        this.nuevoAlquiler.usuario = JSON.parse(usuarioString);
      } catch {
        localStorage.removeItem('usuarioSesion');
        alert('La sesión no es válida. Inicia sesión nuevamente.');
        this.router.navigate(['/login']);
        return;
      }
    } else {
      alert('Debes iniciar sesión para alquilar un vehículo');
      this.router.navigate(['/']);
      return;
    }

    const vehiculo = this.dataService.vehiculoSignal();
    if (vehiculo) {
      this.nuevoAlquiler.vehiculos = vehiculo;
    } else {
      alert('No se ha seleccionado ningún vehículo.');
      this.router.navigate(['/']);
    }
  }

  aceptarAlquiler(): void {
    if (this.nuevoAlquiler.fechaInicio < this.fechaMinima) {
      alert('La fecha de inicio no puede estar en el pasado.');
      return;
    }
    const inicio = this.fechaEnUTC(this.nuevoAlquiler.fechaInicio);
    const entrega = this.fechaEnUTC(this.nuevoAlquiler.fechaEntrega);
    const dias = Math.ceil((entrega - inicio) / 86_400_000);
    if (!Number.isFinite(dias) || dias <= 0) {
      alert('La fecha de entrega debe ser posterior a la fecha de inicio.');
      return;
    }

    this.nuevoAlquiler.valorTotal = dias * Number(this.nuevoAlquiler.vehiculos?.precio ?? 0);
    this.alquilerServicio.guardarAlquiler(this.nuevoAlquiler).subscribe({
      next: (datoGuardado) => {
        alert('Solicitud registrada. Quedará pendiente de aprobación por administración.');
        this.generarPDF(datoGuardado);
      },
      error: (err) => {
        alert(err.error?.mensaje ?? err.error ?? 'Error al registrar el alquiler.');
        console.error(err);
      },
    });
  }

  private fechaEnUTC(fecha: string): number {
    const [anio, mes, dia] = (fecha ?? '').split('-').map(Number);
    return Date.UTC(anio, mes - 1, dia);
  }

  volver(): void {
    window.history.back();
  }

  generarPDF(alquilerGuardado: Partial<Alquileres>): void {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const alquiler = { ...this.nuevoAlquiler, ...alquilerGuardado } as Alquileres;
    const vehiculo = alquiler.vehiculos ?? this.nuevoAlquiler.vehiculos;
    const usuario = alquiler.usuario ?? this.nuevoAlquiler.usuario;
    const numeroDoc = alquiler.numeroAlquiler ?? 'Reciente';
    const pageWidth = doc.internal.pageSize.getWidth();
    const left = 16;
    const right = pageWidth - 16;
    const text = (label: string, value: unknown, x: number, y: number, maxWidth = right - x) => {
      doc.setFont('helvetica', 'normal');
      const content = `${label}: ${value === null || value === undefined || value === '' ? 'N/A' : String(value)}`;
      doc.text(doc.splitTextToSize(content, maxWidth), x, y);
    };
    const heading = (title: string, y: number) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(30, 45, 65);
      doc.text(title, left, y);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
    };

    doc.setTextColor(24, 55, 85);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(21);
    doc.text('SOLICITUD DE ALQUILER', pageWidth / 2, 20, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(left, 26, right, 26);

    doc.setFontSize(11);
    doc.text(`N° de Alquiler: ${numeroDoc}`, left, 36);
    doc.text(`Estado: ${alquiler.estado || 'Pendiente de aprobación'}`, 110, 36, { maxWidth: right - 110 });

    doc.setFontSize(14);
    heading('1. Datos del Usuario', 51);
    doc.setFontSize(11);
    text('Nombre de usuario', usuario?.nombreCompleto, 21, 59);
    text('Identificación', usuario?.idUsuario, 21, 66);

    heading('2. Fechas del Alquiler', 82);
    doc.setFontSize(11);
    text('Fecha de Inicio', alquiler.fechaInicio, 21, 90);
    text('Fecha de Entrega', alquiler.fechaEntrega, 21, 97);

    heading('3. Información del Vehículo', 113);
    doc.setFontSize(11);
    text('Vehículo', vehiculo?.nombre, 21, 121);
    text('Tipo de Vehículo', vehiculo?.tipoVehiculo?.nombre, 21, 128);
    text('Placa', vehiculo?.placa, 21, 135);
    text('Color', vehiculo?.color, 21, 142);
    text('Estado del Vehículo', 'Disponible', 21, 149);

    doc.setLineWidth(0.25);
    doc.line(left, 160, right, 160);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    const valor = Number(alquiler.valorTotal ?? 0).toLocaleString('es-CO');
    doc.text(`VALOR TOTAL DEL ALQUILER: $ ${valor} COP`, left, 173, { maxWidth: right - left });

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(
      'Solicitud generada por Cacharrito. El alquiler queda pendiente de aprobación y este documento no es una factura ni un comprobante de pago.',
      pageWidth / 2,
      277,
      { align: 'center', maxWidth: pageWidth - 30 },
    );
    doc.save(`Comprobante_Alquiler_${numeroDoc}.pdf`);
  }
}
