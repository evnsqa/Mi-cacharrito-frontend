import { Service } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../entidades/usuario';

@Injectable({
  providedIn: 'root'
})

export class UsuarioServicio {
    constructor(private httpCliente: HttpClient) {}
    private listaUsuarios = "https://mi-cacharrito-backend-production.up.railway.app/api/usuarios/listarTodo"
    private loginU = "https://mi-cacharrito-backend-production.up.railway.app/api/usuarios/login"
    private registroU = "https://mi-cacharrito-backend-production.up.railway.app/api/usuarios/registro"
    private buscarNombre = "https://mi-cacharrito-backend-production.up.railway.app/api/usuarios/nombreCompleto"
    private eliminarU = "https://mi-cacharrito-backend-production.up.railway.app/api/usuarios/eliminarUsuario/"


    listarUsusarios(): Observable<any>{
        return this.httpCliente.get(`${this.listaUsuarios}`)
    }

    registroUsuario(usuario: Usuario): Observable<any>{
        return this.httpCliente.post(`${this.registroU}`, usuario)
    }

    loginUsuario(identificacion: string, password: string): Observable<any>{
        const params = new HttpParams().set("identificacionUsuario", identificacion).set("password", password)
        return this.httpCliente.post(`${this.loginU}`, null, {params: params})
    }

    buscarNombreC(nombre: string): Observable<any>{
        const params = new HttpParams().set("nombre", nombre)
        return this.httpCliente.get(`${this.buscarNombre}`, {params: params})
    }

    eliminarUsuario(id: string){
        return  this.httpCliente.post(`${this.eliminarU}`, id)
    }
}
