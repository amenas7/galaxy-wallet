import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ElementRef, AfterViewInit, ViewChild} from '@angular/core';
import { WalletHttp } from '../../http/wallet.http';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { startWith, tap } from 'rxjs';
import { WalletDTO } from '../../interfaces/wallet.dto';
import { ToastrService } from 'ngx-toastr';
import { WalletItemResponse } from '../../interfaces/wallet-item.response';
import { WalletModel } from '../../models/wallet.model';
declare var window: any;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);

  private walletsHttp = inject(WalletHttp);
  private toastr = inject(ToastrService); 

  // TODO: refactorizar con tipado
  wallets: any[] = [];
  formModalNew: any;
  wallet: WalletItemResponse = { id : 0, name: '', amount: 0, userId: 0};
  tipo: any[] = [{"id": 1, "name": "ingreso"}, {"id": 2,"name": "gasto"}];
  title: boolean = true;
  totalAmount: number = 0;

  //
  formGroup: FormGroup<{
    name: FormControl;
    amount: FormControl;
  }>;
  //

  constructor() {
    this.formGroup = this.fb.group({
      name: [null, [Validators.required]],
      amount: [null, [Validators.required]]
    });

  }

  ngOnInit(): void {
    this.load();

    this.formModalNew = new window.bootstrap.Modal(
      document.getElementById('exampleModalWallet')
    );
  }

  load() {
    this.walletsHttp.getAll().subscribe(wallets => this.wallets = wallets);

    this.walletsHttp.gettotalAmount().subscribe(wallet => this.totalAmount = wallet.amount);
  }

  ngAfterViewInit(): void {

  }

  AddModalWallet(){
    this.resetModal();

    //seteando objeto
    this.wallet = { id : 0, name: '', amount: 0, userId: 0};
  }

  resetModal(){
    this.title = false;
    this.formGroup.reset();
    this.formModalNew.show();
  }

  EdditModalWallet(item: WalletModel){
    this.resetModal();

    this.walletsHttp.getOne(item.id).subscribe({
      next: (data) => {

        this.wallet = { ...item };

        this.formGroup.patchValue({
          name: item.name,
          amount: item.amount
        });

      },
      error: ( err: any)=> {
        console.log(err);
      }
    });
  }


  save() {

    if (this.formGroup.invalid) return;

    //registra
    if (this.wallet.id === 0) {
      this.walletsHttp.create({
        name: this.formGroup.get('name')?.value,
        amount: parseFloat(this.formGroup.get('amount')?.value)
      }).subscribe({
        next: (data) => {
          this.formGroup.reset();
          this.formModalNew.hide();
          this.load();
          this.toastr.success(`Billetera registrada`, 'Bien');
        },
        error: ( err: any)=> {
          console.log(err);
        }
      });
    }else{
      //actualiza
      this.walletsHttp.update(
        this.wallet.id, 
        {
          name: this.formGroup.get('name')?.value,
          amount: parseFloat(this.formGroup.get('amount')?.value)
        }
        ).subscribe({
        next: (data) => {
          this.formGroup.reset();
          this.formModalNew.hide();
          this.load();
          this.toastr.success(`Billetera actualizada`, 'Bien');
        },
        error: ( err: any)=> {
          console.log(err);
        }
      });
    }

     
  }

  deleteWallet(id: number){
    Swal.fire({
      icon: 'warning',
      title: '¿Desea eliminar esta billetera?',
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: `Cancelar`,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#284FAE',
    }).then((result) => {
      if (result.isConfirmed) {

        this.walletsHttp.delete(id).subscribe( {
          next: (data) => {
            this.load();
            Swal.fire({
              title: 'Billetera eliminada', 
              icon: 'success',
              confirmButtonText: 'Continuar',
              confirmButtonColor: '#284FAE'
            });
          },
          error: ( err: any)=> {
            console.log(err);
          }
        });

      } else if (result.isDismissed) {
        return;
      }
    })
  }

  
  validarInputNumerico(event: any) {

    console.log("event...", event);
    // Permitir solo dígitos numéricos
    if ((event.which < 48 || event.which > 57) && event.which !== 8) {
        // event.which 48-57 corresponde a 0-9 en el teclado
        // event.which 8 corresponde a la tecla de retroceso (backspace)
        event.preventDefault(); // Prevenir la acción por defecto
    }

    
  }

  onlyNumbers(target: any) {
    // Verificar si el valor ingresado es numérico
    const valor = target.value;
    if (!/^\d*\.?\d*$/.test(valor)) {
      // Si no es numérico, puedes limpiar el input o tomar otra acción
      target.value = valor.replace(/[^0-9.]/g, '');
    }
  }

  onlyLetters(target: any) {
    // Verificar si el valor ingresado contiene solo letras (incluyendo tildes y espacios)
    const valor = target.value;
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]*$/.test(valor)) {
      // Si contiene caracteres no permitidos, los elimina
      target.value = valor.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]/g, '');
    }
  }

}
