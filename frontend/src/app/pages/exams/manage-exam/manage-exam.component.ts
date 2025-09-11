import { Component, Inject, OnInit } from '@angular/core';
import { BaseComponent } from '../../../shared/utils/base.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { distinctUntilChanged, finalize } from 'rxjs';
import { ExamService } from '../../../services/exam/exam.service';
import { Exam } from '../../../services/exam/interfaces/exam.interface';
import { ExamDto } from '../../../services/exam/dto/exam.dto';
import { DicomModality } from '../../../services/exam/enums/dicom-modality.enum';
import { MatSelectModule } from '@angular/material/select';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-manage-exam',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './manage-exam.component.html',
  styleUrl: './manage-exam.component.scss',
})
export class ManageExamComponent extends BaseComponent implements OnInit {
  public isLoading = true;
  public isBusy = false;
  public form: FormGroup;
  public exam: Exam | null = null;
  public modalities = Object.values(DicomModality);

  private attemptKey: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private readonly dialogRef: MatDialogRef<ManageExamComponent>,
    private readonly examService: ExamService
  ) {
    super();

    this.exam = this.data.exam ?? null;

    this.form = new FormGroup({
      id: new FormControl({
        value: this.data.exam?.id ?? undefined,
        disabled: !!!this.data.exam?.id,
      }),
      patientId: new FormControl((this.data.patientId || this.data.patient?.id) ?? '', [
        Validators.required,
      ]),
      modality: new FormControl<DicomModality | null>(this.data.exam?.modality ?? null, [
        Validators.required,
      ]),
      requestedAt: new FormControl<Date>({
        value: this.data.exam?.requestedAt ?? new Date(),
        disabled: !!this.data.exam?.modality,
      }),
    });

    this.isLoading = false;
    this.form.get('modality')?.valueChanges.pipe(distinctUntilChanged()).subscribe(() => {
      this.clearAttemptKey();
    });
  }

  public ngOnInit() {
    this.loadAttemptKey();
  }

  public onSubmit() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      this.showSnackBar('Preencha todos os campos obrigatórios.', 'error');
      return;
    }

    if (!this.attemptKey) {
      this.attemptKey = uuidv4();
      this.persistAttemptKey();
    }

    this.isBusy = true;
    const dto: ExamDto = this.form.value;
    dto.idempotencyKey = this.attemptKey ?? '';

    this.examService
      .create(dto)
      .pipe(finalize(() => (this.isBusy = false)))
      .subscribe({
        next: () => {
          this.showSnackBar(`Exame criado com sucesso`, 'success');
          this.onCloseDialog();
          this.clearAttemptKey();
        },
        error: (error) => {
          console.error(error);
          this.showDialog({
            message: `Parece que houve um erro! Se o problema persistir, entre em contato conosco. ${error.message}`,
            title: 'Ops!',
            actions: [
              {
                label: 'Cancelar',
                value: false,
              },
              {
                label: 'Tentar novamente',
                value: true,
              },
            ],
          }).then((res) => {
            if (res) {
              this.onRetry();
            }
          });
        },
      });
  }

  public onRetry() {
    this.onSubmit();
  }

  public onCloseDialog(callback: any = false) {
    this.dialogRef.close(callback);
  }

  private persistAttemptKey(): void {
    const key = this.attemptKey;
    const draftId = 'exam:create';
    if (key) sessionStorage.setItem(`idem:${draftId}`, key);
  }

  private loadAttemptKey(): void {
    const draftId = 'exam:create';
    const k = sessionStorage.getItem(`idem:${draftId}`);
    this.attemptKey = k || '';
  }

  private clearAttemptKey() {
    const draftId = 'exam:create';
    sessionStorage.removeItem(`idem:${draftId}`);
    this.attemptKey = null;
  }
}
