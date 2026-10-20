import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoVehiculo } from '../entidades/tipo-vehiculo';
import { API_BASE_URL } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class ServiciosTipoVehiculo {

  constructor(private httpCliente: HttpClient) { }
  private listaTV = `${API_BASE_URL}/tipovehiculo/t/listarTodo/`;
  private guardarTV = `${API_BASE_URL}/tipovehiculo/t/guardarTipoVehiculo/`;
  private eliminarTV = `${API_BASE_URL}/tipovehiculo/t/eliminarTipoVehiculo/`;
  private buscarId = `${API_BASE_URL}/tipovehiculo/t/buscarId/`;
  private buscarN = `${API_BASE_URL}/tipovehiculo/t/buscarNom/`;

  listarTipoVehiculo(): Observable<any> {
    return this.httpCliente.get(this.listaTV);
  }

  guardarTipoVehiculo(tipoVehiculo : TipoVehiculo): Observable<any>{
    return this.httpCliente.post(`${this.guardarTV}`,tipoVehiculo);
  }

  eliminarTipoVehiculo(idTipoVehiculo: number): Observable<any> {
    return this.httpCliente.post(`${this.eliminarTV}`, idTipoVehiculo);
  }

  buscarTipoVehiculo(idTipoVehiculo: number): Observable<TipoVehiculo> {
    return this.httpCliente.post<TipoVehiculo>(`${this.buscarId}?id=${idTipoVehiculo}`, null);
  }

  buscarNombre(nombre: string): Observable<TipoVehiculo[]> {
    const params = new HttpParams().set('nombre', nombre);
    return this.httpCliente.post<TipoVehiculo[]>(this.buscarN, null, { params });
  }
}
