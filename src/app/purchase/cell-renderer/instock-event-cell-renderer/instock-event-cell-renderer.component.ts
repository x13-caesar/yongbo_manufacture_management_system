import { Component } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';
import {FormControl, Validators} from '@angular/forms';
import * as Http from 'http';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {InstockItem} from '../../../shared/models/instock';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-instock-event-cell-renderer',
  templateUrl: './instock-event-cell-renderer.component.html',
  styleUrls: ['./instock-event-cell-renderer.component.scss']
})
export class InstockEventCellRendererComponent implements ICellRendererAngularComp {
  public new_instock_amount: number
  public params!: ICellRendererParams;

  constructor(
    public http: HttpClient,
    public _snackBar: MatSnackBar
  ) {
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.new_instock_amount = 0;
  }

  refresh(params: ICellRendererParams<any>): boolean {
    return false;
  }

  isAbleToInstock(): boolean {
    const instockDate = new Date(this.params.node.data['instock_date'])
    const currentDate = new Date();
    const date_valid = instockDate.getMonth() <= currentDate.getMonth()
    const quantity_valid = this.params.node.data['warehouse_quantity'] + this.new_instock_amount <= this.params.node.data['order_quantity']
    return (this.new_instock_amount > 0) && date_valid && quantity_valid
  }

  onNewInstockConfirm() {
    const new_instock_event = {
      instock_item_id: this.params.node.data['instock_item_id'],
      new_instock_amount: this.new_instock_amount
    }
    this.http.put<InstockItem>(`${environment.API_URL}/instock/new-instock-event`, new_instock_event).subscribe({
      next: (response: InstockItem) => {
        this.params.node.setData(response);
        this.autoFadeSnackBar("入库记录成功", 1000);
      },
      error: (err: any) => {
        alert(err.message)
      }
    })
  }

  autoFadeSnackBar(text: string, timeout: number) {
    this._snackBar.open(text, "关闭");
    setTimeout(() => this._snackBar.dismiss(), timeout);
  }

}
