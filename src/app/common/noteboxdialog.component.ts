import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SessionService } from "../service/session.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppConfig } from "../const/app.config";

@Component({
    templateUrl: './noteboxdialog.component.html',
    styleUrls: ['./noteboxdialog.component.css']
})

export class NoteBoxDialogComponent implements OnInit {

    @Input() DialogHeader: string;
    @Input() DialogMessage: string;

    Header: string;
    Message: string;

    constructor(public dialogRef: MatDialogRef<NoteBoxDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public DialogInfo: any,)
    {    }

    ngOnInit() {
        this.Header = this.DialogInfo.Header;
        this.Message = this.DialogInfo.Message;
    }

    submitClick() {

        this.dialogRef.close(0);

        }
}
