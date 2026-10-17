import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alquileres } from '../entidades/alquileres';

@Injectable({
    providedIn: 'root'
})
export class AlquilerServicio {
    
    constructor(private httpCliente: HttpClient) {}

    private guardar = "http://localhost:8080/alquileres/guardarAlquiler/";
    private listarPorUsuario = "http://localhost:8080/alquileres/listarPorUsuario/";
    private listarEntregados = "http://localhost:8080/alquileres/listarEntregados/";
    private cancelar = "http://localhost:8080/alquileres/cancelarAlquiler/";
    private listarPendientes = "http://localhost:8080/alquileres/listarPendientes/";
    private entregar = "http://localhost:8080/alquileres/entregarVehiculo/";
    private devolver = "http://localhost:8080/alquileres/devolverVehiculo/";

    guardarAlquiler(alquiler: Alquileres): Observable<any> {
        return this.httpCliente.post(this.guardar, alquiler);
    }

    listarAlquileresPorUsuario(idUsuario: number): Observable<any> {
    const params = new HttpParams().set("idUsuario", idUsuario);
    return this.httpCliente.get(this.listarPorUsuario, { params: params });
}

    listarAlquileresEntregados(): Observable<any> {
    return this.httpCliente.get(this.listarEntregados);
}

    cancelarAlquiler(id: number): Observable<any> {
    const params = new HttpParams().set("id", id);
    return this.httpCliente.post(this.cancelar, null, { params: params });
    }

    listarAlquileresPendientes(): Observable<any> {
    return this.httpCliente.get(this.listarPendientes);
    }


    entregarVehiculo(placa: string): Observable<any> {
    const params = new HttpParams().set("placa", placa);
    return this.httpCliente.post(this.entregar, null, { params: params });
    }

    devolverVehiculo(id: number): Observable<any> {
    const params = new HttpParams().set("id", id);
    return this.httpCliente.post(this.devolver, null, {
        params: params,
        responseType: 'text'
    });
}
}







