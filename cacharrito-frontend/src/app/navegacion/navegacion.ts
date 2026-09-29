import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, CommonModule, RouterModule],
  selector: 'app-navegacion',
  styleUrl: './navegacion.css',
  templateUrl: './navegacion.html',
})
export class Navegacion implements OnInit {
  usuarioActivo: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const usuarioGuardado = localStorage.getItem('usuarioSesion');
    
    if (usuarioGuardado) {
      this.usuarioActivo = JSON.parse(usuarioGuardado);
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuarioSesion');
    this.usuarioActivo = null;
    
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

}
