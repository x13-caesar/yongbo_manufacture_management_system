import {Component, OnInit, ViewChild} from '@angular/core';
import {Delivery, delivery_col_def} from '../shared/models/delivery';
import {DeliveryService} from '../shared/http-services/delivery.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {environment} from '../../environments/environment';
import {CreateDeliveryDialogComponent} from './create-delivery-dialog/create-delivery-dialog.component';
import {ProductService} from '../shared/http-services/product.service';
import {JWTTokenService} from '../shared/http-services/jwt-token.service';
import {
  CellEditingStoppedEvent,
  ColDef,
  ColumnApi,
  GridApi,
  GridReadyEvent,
  RowClassRules,
  RowEditingStoppedEvent
} from 'ag-grid-community';
import {default_ag_grid_col_def} from '../shared/definition/grid-def';
import {AG_GRID_LOCALE_ZH} from '../shared/locale.zh';
import {AgGridAngular} from 'ag-grid-angular';
import {HttpClient} from '@angular/common/http';
import {autoFadeSnackBar} from '../shared/util/notifications';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {
  start: string;
  end: string;

  // grid 必备 fields
  public ColumnDefs: ColDef[] = delivery_col_def
  public defaultColDef: ColDef = default_ag_grid_col_def

  public localeText: {
    [key: string]: string;
  } = AG_GRID_LOCALE_ZH;

  public gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;

  public rowData!: Delivery[]

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(
    public jwtTokenService: JWTTokenService,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    public http: HttpClient,
  ) { }

  ngOnInit(): void {
  }

  openCreateDeliveryDialog(): void {
    const dialogRef = this.dialog.open(CreateDeliveryDialogComponent, {
      width: environment.MEDIAN_DIALOG_WIDTH,
    });

    dialogRef.afterClosed().subscribe(new_delivery => {
      if (new_delivery) {
        this.rowData.push(new_delivery);
      }
    });
  }

  // 以下为grid 必备函数

  updateGridData(): void {
    this.http.get<Delivery[]>(`${environment.API_URL}/delivery/all`).subscribe({
      next: (data) => {this.rowData = data},
      error: error => alert(error.message)
    })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.updateGridData();
    this.gridApi.sizeColumnsToFit();
  }

  onBtnExport() {
    this.gridApi.exportDataAsExcel();
  }

  autoSizeAll(skipHeader: boolean) {
    const allColumnIds: string[] = [];
    this.gridColumnApi.getColumns()!.forEach((column) => {
      allColumnIds.push(column.getId());
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  onRowEditingStopped($event: RowEditingStoppedEvent<any>) {
    console.log($event.data);
    this.http.put<Delivery>(`${environment.API_URL}/delivery`, $event.data).subscribe({
      next: (response) => {
        console.log(response);
        // $event.node.setData(response)
        // this.rowData.forEach((row) => {if (row.id === response.id) {row = response}});
        this.autoFadeSnackBar("修改交付记录成功", 3000);
      },
      error: (error) => {
        alert(error.message);
      }
    })
  }

  autoFadeSnackBar(text: string, timeout: number) {
    this._snackBar.open(text, "关闭");
    setTimeout(() => this._snackBar.dismiss(), timeout);
  }


  filterByDateRange() {
    this.gridApi.setFilterModel({
      deliver_date: {
        type: 'inRange',
        dateFrom: this.start,
        dateTo: this.end,
        filterType: "date"
      }
    });
  }

  onCellEditingStopped($event: CellEditingStoppedEvent<any>) {
    const id = $event.data.id;
    const paid = $event.data.paid;
    const reconciled = $event.data.reconciled;
    this.http.put<any>(`${environment.API_URL}/delivery/status-change?id=${id}&paid=${paid}&reconciled=${reconciled}`, null).subscribe({
      next: (response) => {
        autoFadeSnackBar(this._snackBar, "修改交付记录成功", 3000)
      },
      error: (err) => {
        alert(err.message);
      }
    })
  }
}
