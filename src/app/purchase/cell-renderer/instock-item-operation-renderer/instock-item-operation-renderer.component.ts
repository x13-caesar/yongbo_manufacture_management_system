import { Component } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {InstockItem} from '../../../shared/models/instock';
import {ICellRendererParams} from 'ag-grid-community';
import {InstockDetailDialogComponent} from '../../instock-detail-dialog/instock-detail-dialog.component';
import {environment} from '../../../../environments/environment';
import {MatDialog} from '@angular/material/dialog';
import {InstockRecordViewDialogComponent} from '../../instock-record-view-dialog/instock-record-view-dialog.component';
import {InstockFormSingleViewDialogComponent} from '../../instock-form-single-view-dialog/instock-form-single-view-dialog.component';
import {NewInstockEventDialogComponent} from '../../new-instock-event-dialog/new-instock-event-dialog.component';

@Component({
  selector: 'app-instock-item-operation-renderer',
  templateUrl: './instock-item-operation-renderer.component.html',
  styleUrls: ['./instock-item-operation-renderer.component.scss']
})
export class InstockItemOperationRendererComponent implements ICellRendererAngularComp {
  public params!: ICellRendererParams
  public item: InstockItem

  constructor(
    private dialog: MatDialog,
  ) {
  }

  agInit(params: ICellRendererParams): void {
    this.item = this.getRowValue(params);
    this.params = params;
  }

  refresh(params: ICellRendererParams<any>): boolean {
    return false;
  }

  private getRowValue(params: ICellRendererParams) {
    return params.node.data;
  }

  onDetailViewClick() {
    const dialogRef = this.dialog.open(InstockDetailDialogComponent, {
      width: environment.LARGE_DIALOG_WIDTH,
      height: "80%",
      data: {
        instock_form_id: this.item.form_id
      }
    })
    dialogRef.afterClosed().subscribe(
      updated_form => {
        if (!!updated_form) {
        }
      }
    )
  }

  onInstockHistoryViewClick() {
    const dialogRef = this.dialog.open(InstockRecordViewDialogComponent, {
      width: environment.LARGE_DIALOG_WIDTH,
      height: "80%",
      data: {
        instock_form_id: this.item.form_id
      }
    })
    dialogRef.afterClosed().subscribe(
      updated_form => {
        if (!!updated_form) {
        }
      })
  }

  onInstockFormViewClick() {
    const dialogRef = this.dialog.open(InstockFormSingleViewDialogComponent, {
      width: environment.LARGE_DIALOG_WIDTH,
      height: "80%",
      data: {
        instock_form_id: this.item.form_id
      }
    })
  }

  onInstockEventClick() {
    const dialogRef = this.dialog.open(NewInstockEventDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      width: environment.LARGE_DIALOG_WIDTH,
      height: "60%",
      data: {
        instock_item: this.item
      }
    })
    dialogRef.afterClosed().subscribe(
      {
        next: result => {
          if (!!result) {
            console.log(result);
            this.params.node.setData(result)
          }
        }
      }
    )
  }
}
