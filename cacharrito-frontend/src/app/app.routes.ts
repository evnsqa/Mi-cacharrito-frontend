import { Routes } from '@angular/router';
import { InicioComponente } from './inicio-componente/inicio-componente';
import { InicioSesion } from './inicio-sesion/inicio-sesion';
import { ContactoComponente } from './contacto-componente/contacto-componente';
import { RegistroUsuario } from './registro-usuario/registro-usuario';
import { AdministradorComponente } from './administrador-componente/administrador-componente';
import { UsuarioCrudComp } from './usuario-crud-comp/usuario-crud-comp';
import { AlquilerComponente } from './alquiler-componente/alquiler-componente';
import { EntregarVehiculoComponente } from './entrega-vehiculo-componente/entrega-vehiculo-componente';
import { CatalogoComponent } from './catalogo/catalogo';
import { TipoVehiculosComponent } from './tipo-vehiculos/tipo-vehiculos';
import { NoticiasComponent } from './noticias/noticias';
import { VehiculoComponente } from './vehiculo-componente/vehiculo-componente';
import { DashboardAdminComponente } from './dashboard-admin-componente/dashboard-admin-componente';
import { DevolucionesComponente} from './devoluciones-componente/devoluciones-componente';
import { CancelarAlquilerComponente } from './cancelar-alquiler-componente/cancelar-alquiler-componente';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: "inicio", component: InicioComponente},
    { path: "login", component: InicioSesion},
    { path: "registro", component: RegistroUsuario},
    { path: "contacto", component: ContactoComponente},
    { path: "ADMINISTRADOR", component: AdministradorComponente},
    { path: "dashboardAdmin", component: DashboardAdminComponente},
    { path: "EntregarVehiculo", component: EntregarVehiculoComponente},
    {path: "crudUsuario", component: UsuarioCrudComp},
    { path: "catalogo", component: CatalogoComponent},
    { path: "noticias", component: NoticiasComponent},
    { path: 'crud', component: UsuarioCrudComp},
    { path: "tipos", component: TipoVehiculosComponent},
    { path: 'vehiculos-por/:tipo', component: VehiculoComponente },
    { path: "crudUsuario", component: UsuarioCrudComp },
    { path: "devoluciones", component: DevolucionesComponente},
    { path: "misAlquileres", component: CancelarAlquilerComponente},
    { path: 'alquiler', component: AlquilerComponente },

];
