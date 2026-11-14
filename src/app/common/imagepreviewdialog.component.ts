import { Component, Inject, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SessionService } from "../service/session.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DocumentImageInfo } from '../model/shared.model';

@Component({
    templateUrl: './imagepreviewdialog.component.html',
    styleUrls: ['./imagepreviewdialog.component.css']
})

export class ImagePreviewDialogComponent implements OnInit {

    public SelectedItem:DocumentImageInfo;
    public DialogHeader: string;
    constructor(public dialogRef: MatDialogRef<ImagePreviewDialogComponent>,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public DialogInputData: any,
        public sessionService: SessionService) {

    }
      
      cancelClick() {        
          this.dialogRef.close(0);
      }
    
      ngOnInit() {          
          this.SelectedItem = this.DialogInputData.SelectedItem;
          this.DialogHeader = this.SelectedItem.HeaderTitle;
      }

      loadImage(selectedImage:DocumentImageInfo){
        this.SelectedItem = selectedImage;
      }

    }
