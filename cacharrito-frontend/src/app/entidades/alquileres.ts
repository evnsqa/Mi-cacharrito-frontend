import { Administrador } from './administrador';
import { Usuario } from './usuario';
import { Vehiculo } from './vehiculo';

export class Alquileres {
    numeroAlquiler: number;
    fechaInicio: string; 
    fechaEntrega: string;
    valorTotal: number;
    estado: string;
    fechaEntregaReal: string;
    pagado: boolean;
    usuario: Usuario;
    administrador: Administrador; 
    vehiculos: Vehiculo; 
}
