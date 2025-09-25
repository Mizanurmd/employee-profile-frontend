import { NgFor } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface EntityDialogData {
  imageUrl?: string;
}

@Component({
  selector: 'app-image-view',
  imports: [MatButtonModule],
  templateUrl: './image-view.html',
  styleUrl: './image-view.css'
})
export class ImageView {
  constructor(
  @Inject(MAT_DIALOG_DATA)public data:EntityDialogData, 
  private matDialog:MatDialogRef<ImageView>){

  }

   // close teacher view
  onClick(){
    this.matDialog.close();
  }

}
