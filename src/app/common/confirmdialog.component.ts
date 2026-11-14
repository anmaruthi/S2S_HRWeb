import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SessionService } from "../service/session.service";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppConfig } from "../const/app.config";

@Component({
    templateUrl: './confirmdialog.component.html',
    styleUrls: ['./confirmdialog.component.css']
})

export class ConfirmDialogComponent implements OnInit {

    Header: string;
    Message: string;

    constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public DialogInput: any)
    {    }

    ngOnInit() {
        this.Header = this.DialogInput.DialogHeader;
        this.Message = this.DialogInput.DialogMessage;
    }

    SubmitClick() {

        this.dialogRef.close(1);

    }

    CancelClick() {

        this.dialogRef.close(0);

    }
}
