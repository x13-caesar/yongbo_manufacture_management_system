import {Component, OnInit, ViewChild} from '@angular/core';
import {Delivery, delivery_col_def} from '../../shared/models/delivery';
import {JWTTokenService} from '../../shared/http-services/jwt-token.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ColDef, ColumnApi, GridApi, GridReadyEvent} from 'ag-grid-community';
import {default_ag_grid_col_def} from '../../shared/definition/grid-def';
import {AG_GRID_LOCALE_ZH} from '../../shared/locale.zh';
import {AgGridAngular} from 'ag-grid-angular';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-monthly-summary',
  templateUrl: './delivery-summary.component.html',
  styleUrls: ['./delivery-summary.component.scss']
})
export class DeliverySummaryComponent implements OnInit {
  startDate: string;
  endDate: string;

  // grid 必备 fields
  public ColumnDefs: ColDef[] = delivery_col_def
  public defaultColDef: ColDef = default_ag_grid_col_def

  public localeText: {
    [key: string]: string;
  } = AG_GRID_LOCALE_ZH;

  public gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;

  public rowData!: Delivery[]

  public summaryAmt: Boolean;
  public product_id_list: string[];

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(
    public jwtTokenService: JWTTokenService,
    public http: HttpClient,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  summarizedAmount(): number {
    return this.rowData.reduce((sum, d) => sum + d.amount, 0);
  }

  summarizedPrice(): number {
    return this.rowData.reduce((sum, d) => sum + d.total_price, 0)
  }

  avgPrice(): number {
    return this.summarizedPrice()/this.summarizedAmount()
  }

  summarizeDeliveriesByProductId(deliveries: Delivery[]): void {
    deliveries.forEach(d => {
      if (d.product_id in this.summaryAmt) {
        // @ts-ignore
        this.summaryAmt[d.product_id] += d.amount
        // @ts-ignore
        this.summaryPx[d.product_id] += d.total_price
      } else {
        this.product_id_list.push(d.product_id);
        // @ts-ignore
        this.summaryAmt[d.product_id] = d.amount
        // @ts-ignore
        this.summaryPx[d.product_id] = d.total_price
      }
    })
  }

  findProductName(product_id: string): string {
    // @ts-ignore
    return this.product_id_name_mapping[product_id];
  }

  findSummaryAmt(product_id: string): number {
    // @ts-ignore
    return this.summaryAmt[product_id];
  }

  findSummaryPx(product_id: string): number {
    // @ts-ignore
    return this.summaryPx[product_id];
  }

  getDateRangeString(start: Date, end: Date): string {
    if (!start || !end) {
      return ``
    }
    return `${start.toLocaleDateString()} ~ ${end.toLocaleDateString()}`
  }

  onDateRangeConfirm() {
    this.updateGridData();

  }

  // 以下为grid 必备函数

  updateGridData(): void {
    this.http.get<Delivery[]>(`${environment.API_URL}/delivery/range?start=${this.startDate}&end=${this.endDate}`).subscribe({
      next: (data) => {
        this.rowData = data;
        this.autoSizeAll(false);
        },
      error: error => alert(error.message)
    })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
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
}
