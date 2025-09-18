import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Teacher } from '../teacher';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-teacher-view',
  imports: [NgIf, MatButtonModule],
  templateUrl: './teacher-view.html',
  styleUrl: './teacher-view.css',
})
export class TeacherView {
  constructor(@Inject(MAT_DIALOG_DATA) public teacher: Teacher, private matDialog: MatDialogRef<TeacherView>) {}

  // close teacher view
  onClick(){
    this.matDialog.close();
  }
}
