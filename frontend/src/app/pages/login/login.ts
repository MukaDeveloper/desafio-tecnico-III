import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { BaseComponent } from '../../shared/utils/base.component';
import { finalize } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login extends BaseComponent {
  public form: FormGroup;
  public isBusy = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    super();

    this.form = new FormGroup({
      email: new FormControl<string>('', [Validators.required, Validators.email]),
      password: new FormControl<string>('', [Validators.required]),
    });

    this.verifyAlreadyLogged();
    this.manageSubscriptions();
  }

  public onSubmit() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      this.showSnackBar('Preencha todos os campos obrigatórios.', 'error');
      return;
    }

    const { email, password } = this.form.value;

    this.isBusy = true;
    this.authService
      .login(email, password)
      .pipe(finalize(() => (this.isBusy = false)))
      .subscribe({
        next: (res) => {
          if (this.authService.routeRedirect) {
            const { url, params } = this.authService.routeRedirect;
            this.router
              .navigate([url], {
                queryParams: params,
                replaceUrl: true,
              })
              .catch((error) => {
                this.router.navigate(['/'], {
                  replaceUrl: true,
                });
              });
            return;
          }

          this.router.navigate(['/'], {
            replaceUrl: true,
          });
        },
        error: (error) => {
          if (error.details.statusCode === 404) {
            this.showSnackBar(
              'Usuário ou senha inválidos, verifique suas credenciais.',
              'error',
              5000
            );
            this.form.get('password')?.setErrors({ invalid: true });
            return;
          }

          this.showSnackBar('Autenticação falhou.', 'error', 5000, 'Entendi');
        },
      });
  }

  private manageSubscriptions() {
    this.subscriptions.push(
      this.form.get('email')!.valueChanges.subscribe((value) => {
        if (value && value.length > 0) {
          const passErrors = this.form.get('password')?.errors;
          const emailErrors = this.form.get('email')?.errors;
          if (passErrors && passErrors['invalid']) {
            delete passErrors['invalid'];
            this.form
              .get('password')
              ?.setErrors(Object.keys(passErrors).length ? passErrors : null);
          }
          if (emailErrors && emailErrors['invalid']) {
            delete emailErrors['invalid'];
            this.form.get('email')?.setErrors(Object.keys(emailErrors).length ? emailErrors : null);
          }
        }
        this.cdr.detectChanges();
      }),

      this.form.get('password')!.valueChanges.subscribe((value) => {
        if (value && value.length > 0) {
          const passErrors = this.form.get('password')?.errors;
          const emailErrors = this.form.get('email')?.errors;
          if (passErrors && passErrors['invalid']) {
            delete passErrors['invalid'];
            this.form
              .get('password')
              ?.setErrors(Object.keys(passErrors).length ? passErrors : null);
          }
          if (emailErrors && emailErrors['invalid']) {
            delete emailErrors['invalid'];
            this.form.get('email')?.setErrors(Object.keys(emailErrors).length ? emailErrors : null);
          }
        }
        this.cdr.detectChanges();
      })
    );
  }

  private verifyAlreadyLogged() {
    const loginData = this.authService.loginData;
    if (loginData) {
      this.router.navigate(['/'], { replaceUrl: true });
    }
  }
}
