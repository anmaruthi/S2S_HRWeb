import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SessionService } from "../service/session.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppConfig } from "../const/app.config";

@Component({
    templateUrl: './okdialog.component.html',
    styleUrls: ['./okdialog.component.css']
})

export class OkDialogComponent implements OnInit {

    @Input() DialogHeader: string;
    @Input() DialogMessage: string;

    Header: string;
    Message: string;

    constructor(public dialogRef: MatDialogRef<OkDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public DialogInfo: any,)
    {    }

    ngOnInit() {
        this.Header = this.DialogInfo.DialogHeader;
        this.Message = this.DialogInfo.DialogMessage;
    }

    submitClick() {

        this.dialogRef.close(0);

    }

}
