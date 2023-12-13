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

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppFormsModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SignInComponent {

  private fb = inject(FormBuilder);
  private authHttp = inject(AuthHttp);
  private session = inject(AppSessionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  showPassword = false;

  

  form: FormGroup<{
    email: FormControl;
    password: FormControl;
  }>;

  constructor() {
    this.form = this.fb.group({
      email: [environment.auth.email, [Validators.required, AppValidators.email]],
      password: [environment.auth.password, Validators.required],
    });
  }

  goSignUp(){
    this.router.navigateByUrl('/auth/sign-up');
  }

  signIn() {
    if (this.form.invalid) return;
    // TODO: refactorizar el tipado del response
    this.authHttp.getToken(this.form.value as SignInDto)
      .subscribe((tokens: any) => {
        //debugger;
        this.session.create(tokens.accessToken, tokens.refreshToken);
      });
  }
}
