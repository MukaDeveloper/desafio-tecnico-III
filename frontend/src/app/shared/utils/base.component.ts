import { Component, inject, OnDestroy, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentType } from '@angular/cdk/overlay';
import { firstValueFrom, Subscription, take } from 'rxjs';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { BaseDialogData } from '../models/base-dialog.model';
import { BaseDialogComponent } from '../components/base-dialog/base-dialog.component';

@Component({
  template: '',
  imports: [],
})
export class BaseComponent implements OnDestroy {
  protected dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);

  protected subscriptions: Subscription[] = [];
  protected readonly openedDialogs = new Set<MatDialogRef<any>>();

  constructor() {}

  protected openDialog<T, D = any, R = any>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    config?: MatDialogConfig<D>
  ): MatDialogRef<T, R> {
    const ref = this.dialog.open<T, D, R>(componentOrTemplateRef as any, config);
    this.openedDialogs.add(ref);
    ref
      .afterClosed()
      .pipe(take(1))
      .subscribe(() => this.openedDialogs.delete(ref));
    return ref;
  }

  
  public debugInvalidControls(ctrl: AbstractControl, path = ''): void {
    if (ctrl.disabled) return;

    if (ctrl instanceof FormControl) {
      if (ctrl.invalid) {
        console.log(`[FormControl] ${path} -> status=${ctrl.status}`, ctrl.errors);
      }
      return;
    }

    if (ctrl instanceof FormGroup) {
      if (ctrl.invalid && ctrl.errors) {
        console.log(`[FormGroup]  ${path || '(root)'} -> status=${ctrl.status}`, ctrl.errors);
      }

      Object.entries(ctrl.controls).forEach(([key, child]) =>
        this.debugInvalidControls(child, path ? `${path}.${key}` : key)
      );
      return;
    }

    if (ctrl instanceof FormArray) {
      if (ctrl.invalid && ctrl.errors) {
        console.log(`[FormArray]  ${path} -> status=${ctrl.status}`, ctrl.errors);
      }
      ctrl.controls.forEach((child, idx) => this.debugInvalidControls(child, `${path}[${idx}]`));
    }
  }

  public ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.openedDialogs.forEach((ref) => {
      try {
        ref.close();
      } catch {}
    });
    this.openedDialogs.clear();
  }

  public showDialog(data: BaseDialogData): Promise<any> {
    const dialogRef = this.openDialog(BaseDialogComponent, {
      closeOnNavigation: true,
      data,
      disableClose: true,
      panelClass: data.panelClass || undefined,
    });

    return firstValueFrom(dialogRef.afterClosed().pipe(take(1)));
  }

  public showSnackBar(
    message: string,
    mode: 'success' | 'error',
    duration: number = 5000,
    action?: string
  ) {
    this._snackBar.open(message, action, {
      panelClass: [`custom-${mode}-snackbar`],
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  public validateCNPJ(cnpj: string): boolean {
    if (cnpj.length !== 14) return false;

    const digits = cnpj.split('').map((n) => parseInt(n, 10));

    let sum = 0;
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for (let i = 0; i < 12; i++) {
      sum += digits[i] * weights1[i];
    }
    let remainder = sum % 11;
    const firstCheckDigit = remainder < 2 ? 0 : 11 - remainder;

    if (digits[12] !== firstCheckDigit) return false;

    sum = 0;
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    for (let i = 0; i < 13; i++) {
      sum += digits[i] * weights2[i];
    }
    remainder = sum % 11;
    const secondCheckDigit = remainder < 2 ? 0 : 11 - remainder;

    if (digits[13] !== secondCheckDigit) return false;

    return true;
  }

  public validateCPF(cpf: string): boolean {
    if (cpf.length !== 11) return false;

    const digits = cpf.split('').map((n) => parseInt(n, 10));

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (10 - i);
    }

    let remainder = sum % 11;
    const firstCheckDigit = remainder < 2 ? 0 : 11 - remainder;

    if (digits[9] !== firstCheckDigit) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * (11 - i);
    }
    remainder = sum % 11;
    const secondCheckDigit = remainder < 2 ? 0 : 11 - remainder;

    if (digits[10] !== secondCheckDigit) return false;

    return true;
  }
}
