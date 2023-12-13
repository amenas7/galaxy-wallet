import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AppSessionService } from '../../auth/services/session.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  private session = inject(AppSessionService );

  logOut(){
    Swal.fire({
      icon: 'warning',
      title: '¿Desea cerrar su sesión?',
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: 'Cerrar sesión',
      denyButtonText: `Cancelar`,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#284FAE',
    }).then((result) => {
      if (result.isConfirmed) {

        this.session.destroy();
        
      } else if (result.isDismissed) {
        return;
      }
    })
  }

  


}
