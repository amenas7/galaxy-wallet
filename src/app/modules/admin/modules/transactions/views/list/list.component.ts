import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit, inject, ElementRef, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { TransactionHttp } from '../../http/transaction.http';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { filter, startWith, switchMap, tap} from 'rxjs';
import { TransactionDTO } from '../../interfaces/transaction.dto';
import { ToastrService } from 'ngx-toastr';
import { TransacionItemResponse } from '../../interfaces/transaction-item.response';
import { TransactionModel } from '../../models/transaction.model';
import { TableModule } from 'primeng/table';
import { WalletHttp } from '../../../wallets/http/wallet.http';
import { CategoryHttp } from '../../../categories/http/category.http';
import { MatButtonModule } from '@angular/material/button';
declare var window: any;
import { MatPaginator, PageEvent, MatPaginatorModule } from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatIconModule} from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'  

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatPaginatorModule, MatIconModule, MatTableModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, AfterViewInit {
  @ViewChild('selectWallet') selectWallet?: ElementRef;
  private fb = inject(FormBuilder);

  private transactionsHttp = inject(TransactionHttp);
  private walletsHttp = inject(WalletHttp);
  private categoriesHttp = inject(CategoryHttp);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef)

  // TODO: refactorizar con tipado
  transactions: any[] = [];
  wallets: any[] = [];
  categories: any[] = [];
  formModalNew: any;
  transaction: any = { id : 0, amount: 0, note: '', date: new Date(), category: {} };
  title: boolean = true;
  selectedWallet: number = 0;
  totalAmount: number = 0;

  optionsFilter: any[] = [];
  displayedColumns: string[] = [
    "monto",
    "billetera",
    "fecha",
    "tipo",
    "acciones",
  ];

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

  length = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  //pageEvent!: PageEvent;

  page = 0;
  total: number = 0;
  //

  //
  formGroup: FormGroup<{
    amount: FormControl;
    category: FormControl;
    date: FormControl;
    wallet: FormControl;
    note: FormControl;
    //pageSize: FormControl;
  }>;

  filterForm: FormGroup;
  _wallet_filter: number = 0;

  constructor() {
    this.formGroup = this.fb.group({
      amount: [null, [Validators.required]],
      category: [null, [Validators.required]],
      date: [null, [Validators.required]],
      wallet: [null, [Validators.required]],
      note: [null, [Validators.required]],
    });  
    
    this.filterForm = this.fb.group({
      wallet_filter: [''],
    });

  }

  ngOnInit(): void {
    this.formModalNew = new window.bootstrap.Modal(
      document.getElementById('exampleModalTransaction')
    );

  }

  ngAfterViewInit(): void {
    this.load();

    
  }

  filter() {
    this._wallet_filter = this.filterForm.get('wallet_filter')?.value;
    if (this._wallet_filter) {
      this.load(this._wallet_filter)
    } else {
      this.load();
    }
  }

  resetPaginate(){
    this._wallet_filter = 0;
    this.load();
  }
  

  load(_wallet_filter?: number) {

    this.paginator.page
      .asObservable()
      .pipe(
        startWith({}),
        switchMap(() =>
          this.transactionsHttp.getAll(
            this.paginator.pageSize,
            this.paginator.pageIndex,
            this._wallet_filter
          )
        )
      )
      .subscribe((res) => {
        this.transactions = res;

        this.transactionsHttp.getAllCount().subscribe(total => this.total = total.length);


      });

    this.walletsHttp.getAll().subscribe(wallets => this.wallets = wallets);

    this.walletsHttp.gettotalAmount().subscribe(wallet => this.totalAmount = wallet.amount);

    this.categoriesHttp.getAll().subscribe(categories => this.categories = categories);


  }

  resetModal(){
    this.title = false;
    this.formGroup.reset();
    this.formModalNew.show();
  }


  AddModalTransaction(){
    this.resetModal();

    //seteando objeto
    this.transaction = { id : 0, amount: 0, note: '', date: new Date(), category: null };
  }

  EdditModalTransaction(item: TransactionModel){
    this.resetModal();

    this.transactionsHttp.getOne(item.id).subscribe({
      next: (data) => {

        this.transaction = { ...item };

        //parseando la fecha
        const formattedDate = new Date(item.date).toISOString().split('T')[0];

        this.formGroup.patchValue({
          amount: item.amount,
          category: item.category.id,
          date: formattedDate,
          wallet: item.wallet.id,
          note: item.note
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
    if (this.transaction.id === 0) {
      this.transactionsHttp.create({
        amount: parseInt(this.formGroup.get('amount')?.value),
        categoryId: parseInt(this.formGroup.get('category')?.value),
        date: new Date(this.formGroup.get('date')?.value),
        walletId: parseInt(this.formGroup.get('wallet')?.value),
        note: this.formGroup.get('note')?.value,
      }).subscribe({
        next: (data) => {
          this.formGroup.reset();
          this.formModalNew.hide();
          this.load();
          this.toastr.success(`Movimiento registrado`, 'Bien');
        },
        error: ( err: any)=> {
          console.log(err);
        }
      });
    }else{
      //actualiza
      this.transactionsHttp.update(
        this.transaction.id, {
        amount: parseInt(this.formGroup.get('amount')?.value),
        categoryId: parseInt(this.formGroup.get('category')?.value),
        date: new Date(this.formGroup.get('date')?.value),
        walletId: parseInt(this.formGroup.get('wallet')?.value),
        note: this.formGroup.get('note')?.value,
      }).subscribe({
        next: (data) => {
          this.formGroup.reset();
          this.formModalNew.hide();
          this.load();
          this.toastr.success(`Movimiento actualizado`, 'Bien');
        },
        error: ( err: any)=> {
          console.log(err);
        }
      });
    }

     
  }

  deleteTransaction(id: number){
    Swal.fire({
      icon: 'warning',
      title: '¿Desea eliminar este movimiento?',
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: `Cancelar`,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#284FAE',
    }).then((result) => {
      if (result.isConfirmed) {

        this.transactionsHttp.delete(id).subscribe( {
          next: (data) => {
            this.load();
            Swal.fire({
              title: 'Movimiento eliminado', 
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

  onlyNumbers(target: any) {
    // Verificar si el valor ingresado es numérico
    const valor = target.value;
    if (!/^\d*\.?\d*$/.test(valor)) {
      // Si no es numérico, puedes limpiar el input o tomar otra acción
      target.value = valor.replace(/[^0-9.]/g, '');
    }
  }



}

