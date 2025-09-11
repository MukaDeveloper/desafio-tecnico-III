import { Component, Inject } from '@angular/core';
import { BaseComponent } from '../../../shared/utils/base.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PatientDto } from '../../../services/patient/dto/patient.dto';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PatientService } from '../../../services/patient/patient.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Patient } from '../../../services/patient/interfaces/patient.interface';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-manage-patient',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgxMaskDirective,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [provideNgxMask()],
  templateUrl: './manage-patient.component.html',
  styleUrl: './manage-patient.component.scss',
})
export class ManagePatientComponent extends BaseComponent {
  public isLoading = true;
  public isBusy = false;
  public form: FormGroup;
  public patient: Patient | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private readonly dialogRef: MatDialogRef<ManagePatientComponent>,
    private readonly patientService: PatientService
  ) {
    super();

    this.patient = this.data.patient ?? null;

    this.form = new FormGroup({
      id: new FormControl({
        value: this.data.patient?.id ?? undefined,
        disabled: !!!this.data.patient?.id,
      }),
      name: new FormControl(this.data.patient?.name ?? '', [Validators.required]),
      document: new FormControl(this.data.patient?.document ?? '', [Validators.required]),
    });

    this.isLoading = false;
  }

  public onSubmit() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      this.showSnackBar('Preencha todos os campos obrigatórios.', 'error');
      return;
    }

    const dto: PatientDto = this.form.value;
    const validCpf = this.validateCPF(dto.document);

    if (!validCpf) {
      this.showSnackBar('CPF inválido.', 'error');
      this.form.get('document')?.setErrors({ invalid: true });
      return;
    }

    this.isBusy = true;
    const request$ = this.patient?.id
      ? this.patientService.update(dto)
      : this.patientService.create(dto);

    request$.pipe(finalize(() => (this.isBusy = false))).subscribe({
      next: () => {
        this.showSnackBar(
          `Paciente ${this.patient ? 'atualizado' : 'registrado'} com sucesso`,
          'success'
        );
        this.onCloseDialog();
      },
      error: (error) => {
        console.error(error);
        this.showSnackBar(
          `Ops! Parece que houve um erro! Tente novamente. Se o problema persistir, entre em contato conosco. ${error.message}`,
          'error'
        );
      },
    });
  }

  public onCloseDialog(callback: any = false) {
    this.dialogRef.close(callback);
  }
}
