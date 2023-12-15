import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthHttp } from '../../http/auth.http';
import { SignInDto } from '../../dto/sign-in.dto';
import { AppValidators } from '../../../../common/forms/validators';
import { AppFormsModule } from '../../../../common/forms/forms.module';
import { AppSessionService  } from '../../services/session.service';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppFormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SignUpComponent {

  private fb = inject(FormBuilder);
  private authHttp = inject(AuthHttp);
  private session = inject(AppSessionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  showPassword = false;
  mostrarError: boolean = false;
  

  form: FormGroup<{
    email: FormControl;
    password: FormControl;
    password_repeat: FormControl;
  }>;

  constructor() {
    this.form = this.fb.group({
      email: [environment.auth.email, [Validators.required, AppValidators.email]],
      password: [environment.auth.password, Validators.required],
      password_repeat: [null, Validators.required],
    }, { validators: this.passwordMatchValidator }
    );
  }

  goSignIn(){
    this.router.navigateByUrl('/auth/sign-in');
  }

  get f(){
    return this.form.controls;
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')!.value;
    const confirmPassword = group.get('password_repeat')!.value;

    if (password === confirmPassword) {
      return null;
    } else {
      return { passwordMismatch: true };
    }
  }

  validateEqualsPassword(): boolean{
    const password = this.form.get('password')?.value;
      const password_repeat = this.form.get('password_repeat')?.value;

      if (password === password_repeat) {
        return true;
      } else {
        return false;
      }
  }

  signUp() {
    if (this.form.invalid) {
      this.mostrarError = true; return
    };

    // if(!this.validateEqualsPassword()) {
    //     this.toastr.error('Passwords must be the same');
    //   return
    // };
    // TODO: refactorizar el tipado del response
    this.authHttp.SignUp(
      {
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value
      }
      )
      .subscribe((tokens: any) => {
        this.session.create(tokens.accessToken, tokens.refreshToken);
      });
  }

}
