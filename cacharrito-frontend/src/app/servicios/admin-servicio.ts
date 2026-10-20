import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Administrador } from '../entidades/administrador';
import { API_BASE_URL } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class AdministradorServicio {
    
    constructor(private httpCliente: HttpClient) {}
    private loginA = `${API_BASE_URL}/api/admin/login`

    loginAdministrador(usuarioAdmin: string, passwordAdmin: string): Observable<any> {
        const params = new HttpParams()
            .set("usuarioAdmin", usuarioAdmin)
            .set("passwordAdmin", passwordAdmin)
            
        return this.httpCliente.post(`${this.loginA}`, null, {params: params})
    }
}
