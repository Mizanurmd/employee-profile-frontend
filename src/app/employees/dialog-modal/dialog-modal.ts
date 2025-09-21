import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-modal',
  imports: [MatDialogContent, MatDialogActions, MatIconModule],
  templateUrl: './dialog-modal.html',
  styleUrl: './dialog-modal.css',
})
export class DialogModal {
  constructor(
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DialogModal>,
    @Inject(MAT_DIALOG_DATA) public data: {entityName:string}
  ) {}

  openSnackBar(
    message: string,
    action: string = 'Close',
    duration: number = 3000,
    horizontalPosition: MatSnackBarHorizontalPosition = 'center',
    verticalPosition: MatSnackBarVerticalPosition = 'top'
  ) {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
    });
  }

  onCancel() {
    this.dialogRef.close(false);
    this.openSnackBar(`${this.data.entityName} delete cancelled.`);
  }

  onConfirm() {
    this.dialogRef.close(true);
    this.openSnackBar(`${this.data.entityName} deleted successfully.`);
  }
}
