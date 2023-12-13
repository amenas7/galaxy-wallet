import { Component, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent {
  @Input({ required: true }) control!: FormControl;

  @HostBinding('class')
  get className() {
    return this.control.invalid ? 'invalid-feedback' : '';
  }
}
