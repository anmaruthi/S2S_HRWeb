import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SessionService } from "../service/session.service";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppConfig } from "../const/app.config";

@Component({
    templateUrl: './confirmdialog1.component.html',
    styleUrls: ['./confirmdialog1.component.css']
})

export class ConfirmDialog1Component implements OnInit {

    Header: string;
    Message: string;

    public checked: boolean;

    constructor(public dialogRef: MatDialogRef<ConfirmDialog1Component>,
        @Inject(MAT_DIALOG_DATA) public DialogInput: any, public sessionService: SessionService)
    {
        this.checked = false;
    }

    ngOnInit() {
        this.Header = this.DialogInput.DialogHeader;
        this.Message = this.DialogInput.DialogMessage;
    }

    SubmitClick() {

        if (this.checked){
            this.dialogRef.close(1);
        }
        else
        {
            this.sessionService.showError("Yes, I Agree not selected, select it to proceed or click no");
            return;
        }
    }

    CancelClick() {

        this.dialogRef.close(0);

    }
}
