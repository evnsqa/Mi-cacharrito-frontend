import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { Alquileres } from '../entidades/alquileres';
import { API_BASE_URL } from './api.config';

export interface ResultadoAceptacion {
    mensaje: string;
    correoEnviado: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AlquilerServicio {
    
    constructor(private httpCliente: HttpClient) {}

    private guardar = `${API_BASE_URL}/alquileres/guardarAlquiler/`;
    private listarPorUsuario = `${API_BASE_URL}/alquileres/listarPorUsuario/`;
    private listarEntregados = `${API_BASE_URL}/alquileres/listarEntregados/`;
    private cancelar = `${API_BASE_URL}/alquileres/cancelarAlquiler/`;
    private listarPendientes = `${API_BASE_URL}/alquileres/listarPendientes/`;
    private listarPendientesEntrega = `${API_BASE_URL}/alquileres/listarPendientesEntrega/`;
    private aceptar = `${API_BASE_URL}/alquileres/aceptarAlquiler/`;
    private buscarPorId = `${API_BASE_URL}/alquileres/buscarPorId/`;
    private historialPorUsuario = `${API_BASE_URL}/alquileres/historialPorUsuario/`;
    private historialCompleto = `${API_BASE_URL}/alquileres/historialCompleto/`;
    private pagar = `${API_BASE_URL}/alquileres/pagar/`;
    private entregar = `${API_BASE_URL}/alquileres/entregarVehiculo/`;
    private devolver = `${API_BASE_URL}/alquileres/devolverVehiculo/`;

    guardarAlquiler(alquiler: Alquileres): Observable<any> {
        return this.httpCliente.post(this.guardar, alquiler);
    }

    listarAlquileresPorUsuario(idUsuario: number): Observable<Alquileres[]> {
    const params = new HttpParams().set("idUsuario", idUsuario);
    return this.httpCliente.get<Alquileres[]>(this.listarPorUsuario, { params: params });
}

    listarHistorialPorUsuario(idUsuario: string): Observable<Alquileres[]> {
        const params = new HttpParams().set('idUsuario', idUsuario);
        return this.httpCliente.get<Alquileres[]>(this.historialPorUsuario, { params });
    }

    listarHistorialCompleto(): Observable<Alquileres[]> {
        return this.httpCliente.get<Alquileres[]>(this.historialCompleto);
    }

    listarAlquileresEntregados(): Observable<Alquileres[]> {
    return this.httpCliente.get<Alquileres[]>(this.listarEntregados);
}

    cancelarAlquiler(id: number): Observable<any> {
    const params = new HttpParams().set("id", id);
    return this.httpCliente.post(this.cancelar, null, { params: params });
    }

    listarAlquileresPendientes(): Observable<Alquileres[]> {
    return this.httpCliente.get<Alquileres[]>(this.listarPendientes);
    }

    listarPendientesDeEntrega(): Observable<Alquileres[]> {
        return this.httpCliente.get<Alquileres[]>(this.listarPendientesEntrega);
    }

    aceptarAlquiler(id: number): Observable<ResultadoAceptacion> {
        const params = new HttpParams().set('id', id);
        return this.httpCliente.post<ResultadoAceptacion>(this.aceptar, null, { params });
    }

    buscarAlquiler(id: number): Observable<Alquileres> {
        const params = new HttpParams().set('id', id);
        return this.httpCliente.get<Alquileres>(this.buscarPorId, { params }).pipe(timeout({ first: 15000 }));
    }

    pagarAlquiler(id: number): Observable<Alquileres> {
        const params = new HttpParams().set('id', id);
        return this.httpCliente.post<Alquileres>(this.pagar, null, { params });
    }


    entregarVehiculo(placa: string): Observable<any> {
    const params = new HttpParams().set("placa", placa);
    return this.httpCliente.post(this.entregar, null, { params: params });
    }

    devolverVehiculo(id: number, valorExtra = 0): Observable<string> {
    const params = new HttpParams().set("id", id).set('valorExtra', valorExtra);
    return this.httpCliente.post(this.devolver, null, {
        params: params,
        responseType: 'text'
    });
}
}







