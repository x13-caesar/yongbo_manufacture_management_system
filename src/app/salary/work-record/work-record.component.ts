import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {JWTTokenService} from '../../shared/http-services/jwt-token.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DayInvoiceService} from '../../shared/http-services/day-invoice.service';
import {DayInvoice} from '../../shared/http-services/day-invoice';
import {WorkService} from '../../shared/http-services/work.service';
import {Work, work_grid_def} from '../../shared/models/work';
import {ColDef, ColumnApi, GridApi, GridReadyEvent} from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AG_GRID_LOCALE_ZH} from '../../shared/locale.zh';
import {default_ag_grid_col_def} from '../../shared/definition/grid-def';


@Component({
  selector: 'app-day-invoice-list',
  templateUrl: './work-record.component.html',
  styleUrls: ['./work-record.component.scss']
})
export class WorkRecordComponent implements OnInit {
  // grid 必备 fields
  public workColumnDefs: ColDef[] = work_grid_def
  public defaultColDef: ColDef = default_ag_grid_col_def

  public localeText: {
    [key: string]: string;
  } = AG_GRID_LOCALE_ZH;

  private gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;

  public rowData$!: Observable<any[]>

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(
    public jwtTokenService: JWTTokenService,
    private dialog: MatDialog,
    private workService: WorkService,
    private http: HttpClient,
    public _snackBar: MatSnackBar
  ) { }


  ngOnInit(): void {
  }

  onSuccess(eventString: string): void {
    this._snackBar.open(`${eventString}成功`, "关闭");
  }

  onFailure(eventString: string): void {
    this._snackBar.open(`${eventString}失败`, "关闭");
  }

  // 以下为grid 必备函数

  updateGridData(): void {
    this.rowData$ = this.http
      .get<any[]>(`${environment.API_URL}/work`);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.updateGridData();
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


