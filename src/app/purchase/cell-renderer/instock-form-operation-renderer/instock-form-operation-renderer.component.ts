import { Component } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {InstockForm} from '../../../shared/models/instock';
import {ICellRendererParams} from 'ag-grid-community';
import {environment} from '../../../../environments/environment';
import {MatDialog} from '@angular/material/dialog';
import {InstockRecordViewDialogComponent} from '../../instock-record-view-dialog/instock-record-view-dialog.component';
import {NewInstockEventDialogComponent} from '../../new-instock-event-dialog/new-instock-event-dialog.component';
import {saveAs} from 'file-saver';
import {HttpClient} from '@angular/common/http';
import {InstockFormSingleViewDialogComponent} from '../../instock-form-single-view-dialog/instock-form-single-view-dialog.component';
import {ConfirmFinishFormDialogComponent} from './confirm-finish-form-dialog/confirm-finish-form-dialog.component';

@Component({
  selector: 'app-instock-form-operation-renderer',
  templateUrl: './instock-form-operation-renderer.component.html',
  styleUrls: ['./instock-form-operation-renderer.component.scss']
})
export class InstockFormOperationRendererComponent implements ICellRendererAngularComp {
  public params!: ICellRendererParams
  public form: InstockForm

  constructor(
    private dialog: MatDialog,
    public http: HttpClient
  ) {
  }

  agInit(params: ICellRendererParams): void {
    this.form = this.getRowValue(params);
    this.params = params;
  }

  refresh(params: ICellRendererParams<any>): boolean {
    return false;
  }

  private getRowValue(params: ICellRendererParams) {
    return params.node.data
  }

  onInstockHistoryViewClick() {
    const dialogRef = this.dialog.open(InstockRecordViewDialogComponent, {
      width: environment.LARGE_DIALOG_WIDTH,
      height: "80%",
      data: {
        instock_form_id: this.form.form_id
      }
    })
    dialogRef.afterClosed().subscribe(
      updated_form => {
        if (!!updated_form) {
        }
      })
  }

  onInstockEventClick() {
    const dialogRef = this.dialog.open(NewInstockEventDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      width: environment.LARGE_DIALOG_WIDTH,
      height: "80%",
      data: {
        instock_form: this.form
      }
    })
    dialogRef.afterClosed().subscribe(
      {
        next: result => {
          if (!!result) {
            this.params.node.setData(result)
          }
        }
      }
    )
  }

  onExportExcelClick() {
    const form_id = this.form.form_id;
    const vendor_company = this.form.vendor.company;
    const create_at = this.form.create_time;
    this.http.get(`${environment.API_URL}/instock/form-in-excel?form_id=${form_id}`, {responseType: 'blob'}).subscribe({
        next: blob => saveAs(blob, `${form_id}_${vendor_company}_${create_at.slice(0,10)}.xlsx`),
        error: error => console.log(error)
    })
  }

  onInstockFormViewClick() {
    const dialogRef = this.dialog.open(InstockFormSingleViewDialogComponent, {
      width: environment.LARGE_DIALOG_WIDTH,
      height: "80%",
      data: {
        instock_form_id: this.form.form_id
      }
    })
  }

  onFinishFormClick() {
    const dialogRef = this.dialog.open(ConfirmFinishFormDialogComponent, {
      width: environment.SMALL_DIALOG_WIDTH,
      height: "30%",
      data: this.form
    });
    dialogRef.afterClosed().subscribe(
      updated_form => {
        if (!!updated_form) {
          this.params.node.setData(updated_form)
        }});
  }
}
