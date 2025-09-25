import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudentDto } from '../student';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-view-student',
  imports: [MatButtonModule, NgIf, NgFor],
  templateUrl: './view-student.html',
  styleUrl: './view-student.css',
})
export class ViewStudent {
  constructor(
    private matDialogRef: MatDialogRef<ViewStudent>,
    @Inject(MAT_DIALOG_DATA) public student: StudentDto | null
  ) {
     console.log('Dialog received student:', student);
  }

  // Close modal
  onCancle(): void {
    this.matDialogRef.close();
  }
}
