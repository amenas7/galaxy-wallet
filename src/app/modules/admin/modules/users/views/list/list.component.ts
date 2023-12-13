import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { UserHttp } from '../../http/user.http';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit{

  private usersHttp = inject(UserHttp);

  // TODO: refactorizar con tipado
  users: any[] = [];

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.usersHttp.getAll().subscribe(users => this.users = users);
  }
}
