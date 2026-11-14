import { Component, OnInit } from '@angular/core';
import { WebApiService } from "../service/webapi.service";
import { SessionService } from "../service/session.service";
import { CommonService } from "../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
//import { Deductions } from '../model/shared.model';
import { ThisReceiver } from '@angular/compiler';
import { SaveReponse } from '../model/response.model';
import { AppConfig } from '../const/app.config';
import { SaveShiftRequest } from '../model/request.model';
import { ConfirmDialogComponent } from '../common/confirmdialog.component';
@Component({

  templateUrl: './deductions.component.html',
  styleUrls: ['./deductions.component.scss']
})
export class DeductionsComponent implements OnInit {
  cols: any[];
  // public Mode: string;
  // public selectedData: Deductions;
  // public selectedDataGridItem: Deductions;
  // public dataGridList: Deductions[];
  // public FormColumnsWidth: number;
  // public submitAttempt: boolean;
  // public ShiftEndNetDay: boolean;
  // public ApplicableMale: boolean;
  // public ApplicableFemale: boolean;

  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService) {

  }

  ngOnInit(): void {

   

  }

  
}
