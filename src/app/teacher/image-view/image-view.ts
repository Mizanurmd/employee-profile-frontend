import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-view',
  imports: [MatButton],
  templateUrl: './image-view.html',
  styleUrl: './image-view.css'
})
export class ImageView {
  constructor(@Inject(MAT_DIALOG_DATA)public data:{imageUrl:string}, private matDialog:MatDialogRef<ImageView>){

  }

   // close teacher view
  onClick(){
    this.matDialog.close();
  }

}
