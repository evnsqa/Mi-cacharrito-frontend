import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EnviarDatoServicio {
    private platformId = inject(PLATFORM_ID);
    public vehiculoSignal = signal<any>(this.obtenerVehiculoInicial());
    
    public tipoVehiculoSignal = signal<any>(this.obtenerTipoVehiculoInicial());

    private obtenerVehiculoInicial() {

        if (isPlatformBrowser(this.platformId)) {
            const vehiculoGuardado = localStorage.getItem('vehiculoActual');
            return vehiculoGuardado ? JSON.parse(vehiculoGuardado) : null;
        }
        return null;
    }

    enviar(datosVehiculo: any) {
        console.log('Guardando dato:', datosVehiculo);
        this.vehiculoSignal.set(datosVehiculo);
        localStorage.setItem('vehiculoActual', JSON.stringify(datosVehiculo));
    }

    limpiar() {
        this.vehiculoSignal.set(null);
        localStorage.removeItem('vehiculoActual');
    }



    private obtenerTipoVehiculoInicial() {

        if (isPlatformBrowser(this.platformId)) {
            const tipoVehiculoGuardado = localStorage.getItem('tipoVehiculoActual');
            return tipoVehiculoGuardado ? JSON.parse(tipoVehiculoGuardado) : null;
        }
        return null;
    }

    enviarT(datosTipoVehiculo: any) {
        console.log('Guardando dato:', datosTipoVehiculo);
        this.tipoVehiculoSignal.set(datosTipoVehiculo);
        localStorage.setItem('tipoVehiculoActual', JSON.stringify(datosTipoVehiculo));
    }

    limpiarT() {
        this.tipoVehiculoSignal.set(null);
        localStorage.removeItem('tipoVehiculoActual');
    }
}
