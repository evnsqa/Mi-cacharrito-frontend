import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehiculo } from '../entidades/vehiculo';
import { API_BASE_URL } from './api.config';

@Injectable({
    providedIn: 'root'
})
export class VehiculoServicio {

    constructor(private httpCliente: HttpClient){}
    private listaV=`${API_BASE_URL}/vehiculo/v/listarTodo/`;
    private listaT=`${API_BASE_URL}/tipovehiculo/t/listarTodo/`;
    private guardarV=`${API_BASE_URL}/vehiculo/v/guardarVehiculo/`;
    private eliminarV=`${API_BASE_URL}/vehiculo/v/eliminarVehiculo/`;
    private buscarP=`${API_BASE_URL}/vehiculo/v/buscarPlaca/`;
    private buscarN=`${API_BASE_URL}/vehiculo/v/buscarNom/`;
    private buscarPr=`${API_BASE_URL}/vehiculo/v/buscarPrecio/`;
    private buscarE=`${API_BASE_URL}/vehiculo/v/buscarEstado/`;
    private buscarT=`${API_BASE_URL}/vehiculo/v/buscarPorTipo/`;
    private buscarTE=`${API_BASE_URL}/vehiculo/v/buscarPorTipoEstado/`;


    listarVehiculo(): Observable<any>{
        return this.httpCliente.get(this.listaV);
    }

    listarTipoVehiculos(): Observable<any>{
        return this.httpCliente.get(this.listaT);
    }


    guardarVehiculo(vehiculo: Vehiculo, placaOriginal: string): Observable<any>{
        return this.httpCliente.post(`${this.guardarV}?placaOriginal=${placaOriginal}`, vehiculo);
    }


    eliminarVehiculo(placa: string) : Observable<any> {
        return this.httpCliente.post(`${this.eliminarV}`,placa);
    }

    buscarPlaca(placa: string): Observable<Vehiculo> {
        return this.httpCliente.post<Vehiculo>(`${this.buscarP}?placa=${placa}`,null);
    }

    buscarNombre(nombre: string): Observable<Vehiculo[]> {
        const params = new HttpParams().set('nombre', nombre);
        return this.httpCliente.post<Vehiculo[]>(this.buscarN, null, { params });
    }

    buscarPrecio(precio: number): Observable<Vehiculo[]> {
        const params = new HttpParams().set('precio', precio);
        return this.httpCliente.post<Vehiculo[]>(this.buscarPr, null, { params });
    }

    buscarEstado(estado: string): Observable<Vehiculo[]> {
        const params = new HttpParams().set('estado', estado);
        return this.httpCliente.post<Vehiculo[]>(this.buscarE, null, { params });
    }

    buscarTipo(nombre: string): Observable<Vehiculo[]> {
        const params = new HttpParams().set('nombre', nombre);
        return this.httpCliente.post<Vehiculo[]>(this.buscarT, null, { params });
    }

    buscarPorTipoEstado(nombreTipo: string): Observable<Vehiculo[]> {
        return this.httpCliente.post<Vehiculo[]>(`${this.buscarTE}?nombreTipo=${nombreTipo}`, null);
    }


}
