import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoVehiculo } from '../entidades/tipo-vehiculo';

@Injectable({
  providedIn: 'root'
})
export class ServiciosTipoVehiculo {

  constructor(private httpCliente: HttpClient) { }
  private listaTV = 'http://localhost:8080/tipovehiculo/t/listarTodo/';
  private guardarTV = 'http://localhost:8080/tipovehiculo/t/guardarTipoVehiculo/';
  private eliminarTV = 'http://localhost:8080/tipovehiculo/t/eliminarTipoVehiculo/';
  private buscarId = 'http://localhost:8080/tipovehiculo/t/buscarId/';
  private buscarN = 'http://localhost:8080/tipovehiculo/t/buscarNom/';

  listarTipoVehiculo(): Observable<any> {
    return this.httpCliente.get(this.listaTV);
  }

  guardarTipoVehiculo(tipoVehiculo : TipoVehiculo): Observable<any>{
    return this.httpCliente.post(`${this.guardarTV}`,tipoVehiculo);
  }

  eliminarTipoVehiculo(id: number): Observable<any> {
    return this.httpCliente.post(`${this.eliminarTV}`, id);
  }

  buscarTipoVehiculo(id: number): Observable<TipoVehiculo> {
    return this.httpCliente.post<TipoVehiculo>(`${this.buscarId}?id=${id}`, null);
  }

  buscarNombre(nombre: string): Observable<TipoVehiculo[]> {
    const params = new HttpParams().set('nombre', nombre);
    return this.httpCliente.post<TipoVehiculo[]>(this.buscarN, null, { params });
  }
}