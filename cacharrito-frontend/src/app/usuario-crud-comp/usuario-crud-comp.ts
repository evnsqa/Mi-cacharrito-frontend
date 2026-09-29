import { ChangeDetectorRef, Component, computed, OnInit, signal } from '@angular/core';
import { UsuarioServicio } from '../servicios/usuario-servicio';
import { Usuario } from '../entidades/usuario';
import { Navegacion } from '../navegacion/navegacion';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavAdminComponente } from '../nav-admin-componente/nav-admin-componente';

@Component({
  imports: [Navegacion, FormsModule, RouterModule, NavAdminComponente],
  selector: 'app-usuario-crud-comp',
  styleUrl: './usuario-crud-comp.css',
  templateUrl: './usuario-crud-comp.html',
})

export class UsuarioCrudComp implements OnInit {

  ngOnInit(): void {
    this.mostrarUsuarios()
  }
  constructor(private servicioUsuario: UsuarioServicio,
     private cdr: ChangeDetectorRef){}

  listaU = signal<Usuario[]>([]);
  busqueda: string = "";
  idU: string = "";
  usuarioA: Usuario = new Usuario;

  mostrarUsuarios(){
    this.servicioUsuario.listarUsusarios().subscribe(dato =>{
      this.listaU.set(dato);
      console.log(dato)
      this.cdr.markForCheck();
      
    })
  }

  eliminarU(cc: string){
    this.servicioUsuario.eliminarUsuario(cc).subscribe(dato =>{
      console.log(dato)
      this.mostrarUsuarios()
    })
  }

  actualizarUsuario(u: Usuario){
    this.usuarioA = u;
    this.abrirModal()
  }
  abrirModal(){
      const modal = document.getElementById("registro")
      if(modal!=null)
        modal.style.display='block';
    }

    cerrarModal(){
      this.usuarioA = new Usuario;
      const modal = document.getElementById("registro")
      if(modal!=null)
        modal.style.display='none';
    }

    registrar() {
    this.servicioUsuario.registroUsuario(this.usuarioA).subscribe({
      next: (dato) => {
        console.log(dato);
        alert("Actualizacion exitosa");
        
      },
      error: (err) => {
        alert("Error al actualizar: " + err.error);
        console.error(err);
      }
    });
    this.cerrarModal()
  }
  buscarUsuario() {
  if (this.busqueda.trim() === "") {
    this.mostrarUsuarios();
    return;
  }

  this.servicioUsuario.buscarNombreC(this.busqueda).subscribe({
    next: (dato) => {
      this.listaU.set(dato);
      this.paginaActual.set(1);
      this.cdr.markForCheck();
    },
    error: (err) => {
      console.error(err);
    }
  });
}
  

  paginaActual = signal(1);
  itemsPorPagina = 1;

  datosPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.listaU().slice(inicio, fin);
  });

  totalPaginas = computed(() =>
    Math.ceil(this.listaU().length / this.itemsPorPagina));

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas()) {
      this.paginaActual.set(nuevaPagina);
    }
  }


  }

  

