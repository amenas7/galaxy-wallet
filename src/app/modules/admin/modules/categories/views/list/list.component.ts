import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { CategoryHttp } from '../../http/category.http';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { startWith, tap } from 'rxjs';
import { CategoryDTO } from '../../interfaces/category.dto';
import { ToastrService } from 'ngx-toastr';
import { CategoryItemResponse } from '../../interfaces/category-item.response';
import { CategoryModel } from '../../models/category.model';
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

  private categoriesHttp = inject(CategoryHttp);
  private toastr = inject(ToastrService);
  

  // TODO: refactorizar con tipado
  categories: any[] = [];
  formModalNew: any;
  category: CategoryItemResponse = { id : 0, name: '', type: '', userId: 0};
  tipo: any[] = [{"id": 1, "name": "ingreso"}, {"id": 2,"name": "gasto"}];
  title: boolean = true;

  //
  formGroup: FormGroup<{
    name: FormControl;
    type: FormControl;
  }>;
  //

  constructor() {
    this.formGroup = this.fb.group({
      name: [null, [Validators.required]],
      type: [null, [Validators.required]]
    });

  }
  
  ngOnInit(): void {
    this.load();

    this.formModalNew = new window.bootstrap.Modal(
      document.getElementById('exampleModal')
    );

  }

  ngAfterViewInit(): void {

  }

  load() {
    this.categoriesHttp.getAll().subscribe(categories => this.categories = categories);
  }

  resetModal(){
    this.title = false;
    this.formGroup.reset();
    this.formModalNew.show();
  }

  AddModalCategory(){
    this.resetModal();

    //seteando objeto
    this.category = { id : 0, name: '', type: '', userId: 0};
  }

  EdditModalCategory(item: CategoryModel){
    this.resetModal();

    this.categoriesHttp.getOne(item.id).subscribe({
      next: (data) => {

        this.category = { ...item };

        this.formGroup.patchValue({
          name: item.name,
          type: item.type
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
    if (this.category.id === 0) {
      this.categoriesHttp.create(this.formGroup.getRawValue()).subscribe({
        next: (data) => {
          this.formGroup.reset();
          this.formModalNew.hide();
          this.load();
          this.toastr.success(`Categoria registrada`, 'Bien');
        },
        error: ( err: any)=> {
          console.log(err);
        }
      });
    }else{
      //actualiza
      this.categoriesHttp.update(this.category.id, this.formGroup.getRawValue()).subscribe({
        next: (data) => {
          this.formGroup.reset();
          this.formModalNew.hide();
          this.load();
          this.toastr.success(`Categoria actualizada`, 'Bien');
        },
        error: ( err: any)=> {
          console.log(err);
        }
      });
    }

     
  }

  deleteCategory(id: number){
    Swal.fire({
      icon: 'warning',
      title: '¿Desea eliminar esta categoría?',
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: `Cancelar`,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#284FAE',
    }).then((result) => {
      if (result.isConfirmed) {

        this.categoriesHttp.delete(id).subscribe( {
          next: (data) => {
            this.load();
            Swal.fire({
              title: 'Categoría eliminada', 
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
}
