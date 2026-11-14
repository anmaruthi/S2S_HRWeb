import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SessionService } from "../service/session.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppConfig } from "../const/app.config";

@Component({
    templateUrl: './imagesdialog.component.html',
    styleUrls: ['./imagesdialog.component.css']
})

export class ImagesDialogComponent implements OnInit {

    public ImageData: string;
    public header: string;

    constructor(public dialogRef: MatDialogRef<ImagesDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public DialogInfo: any)
    {  

    }

    ngOnInit() {
        this.ImageData = this.DialogInfo.ImageData;
        this.header = this.DialogInfo.header;
    }

    closeClick(){
        this.dialogRef.close(0);
    }
}
