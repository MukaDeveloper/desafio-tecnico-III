import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BaseDialogData } from '../../models/base-dialog.model';
import { MatButtonModule } from '@angular/material/button';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-base-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule, A11yModule],
  templateUrl: './base-dialog.component.html',
  styleUrl: './base-dialog.component.scss',
})
export class BaseDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BaseDialogData,
  ) {}

  close(result: any) {
    this.dialogRef.close(result);
  }
}
