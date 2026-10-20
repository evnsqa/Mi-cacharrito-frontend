import { ChangeDetectorRef, Component, computed, OnInit, signal } from '@angular/core';
import { UsuarioServicio } from '../servicios/usuario-servicio';
import { Usuario } from '../entidades/usuario';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavAdminComponente } from '../nav-admin-componente/nav-admin-componente';

@Component({
  imports: [FormsModule, RouterModule, NavAdminComponente],
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
  esNuevoUsuario = false;
  guardando = false;

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
    this.esNuevoUsuario = false;
    this.usuarioA = { ...u, password: '' };
    this.abrirModal()
  }

  abrirCrearUsuario(): void {
    this.esNuevoUsuario = true;
    this.usuarioA = new Usuario();
    this.abrirModal();
  }

  limitarDigitos(evento: Event, campo: 'idUsuario' | 'telefono'): void {
    const input = evento.target as HTMLInputElement;
    const valor = input.value.replace(/\D/g, '').slice(0, 10);
    input.value = valor;
    this.usuarioA[campo] = valor;
  }

  abrirModal(){
      const modal = document.getElementById("registro")
      if(modal!=null)
        modal.style.display='block';
    }

    cerrarModal(){
      this.usuarioA = new Usuario;
      this.esNuevoUsuario = false;
      const modal = document.getElementById("registro")
      if(modal!=null)
        modal.style.display='none';
    }

    registrar() {
    if (this.guardando) return;
    this.guardando = true;
    this.servicioUsuario.registroUsuario(this.usuarioA).subscribe({
      next: (dato) => {
        console.log(dato);
        alert(this.esNuevoUsuario ? 'Usuario creado correctamente.' : 'Actualización exitosa.');
        this.guardando = false;
        this.cerrarModal();
        this.mostrarUsuarios();
      },
      error: (err) => {
        alert((this.esNuevoUsuario ? 'Error al crear usuario: ' : 'Error al actualizar: ') + (err.error?.mensaje ?? err.error ?? 'revisa los datos e intenta de nuevo.'));
        console.error(err);
        this.guardando = false;
      },
    });
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
  itemsPorPagina = 10;

  datosPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.listaU().slice(inicio, fin);
  });

  totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.listaU().length / this.itemsPorPagina)));

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas()) {
      this.paginaActual.set(nuevaPagina);
    }
  }


  }

  

