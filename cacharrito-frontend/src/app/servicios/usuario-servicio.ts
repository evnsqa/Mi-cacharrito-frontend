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
    private listaUsuarios = "http://localhost:8080/api/usuarios/listarTodo"
    private loginU = "http://localhost:8080/api/usuarios/login"
    private registroU = "http://localhost:8080/api/usuarios/registro"
    private buscarNombre = "http://localhost:8080/api/usuarios/nombreCompleto"
    private eliminarU = "http://localhost:8080/api/usuarios/eliminarUsuario/"


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
