import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-nav-admin-componente',
  styleUrl: './nav-admin-componente.css',
  templateUrl: './nav-admin-componente.html',
})
export class NavAdminComponente {

  usuarioActivo: any = null;

  constructor(private router: Router) {}

  cerrarSesion(): void {
    localStorage.removeItem('usuarioSesion');
    this.usuarioActivo = null;
    this.router.navigate(['/login']).then(() => {
      window.location.reload();

    });

  }

}