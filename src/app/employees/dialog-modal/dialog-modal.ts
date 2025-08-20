import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dialog-modal',
  imports: [MatDialogContent, MatDialogActions, MatIconModule],
  templateUrl: './dialog-modal.html',
  styleUrl: './dialog-modal.css'
})
export class DialogModal {
  constructor(private dialogRef: MatDialogRef<DialogModal>,
    @Inject(MAT_DIALOG_DATA) public data: any){

    }

    onCancel() {
    this.dialogRef.close(false);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }

}
