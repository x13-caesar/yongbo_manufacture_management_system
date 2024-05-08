import {Component, OnInit, ViewChild} from '@angular/core';
import {ColDef, ColumnApi, GridApi, GridReadyEvent} from 'ag-grid-community';
import {instock_form_col_def, instock_record_col_def} from '../../shared/models/instock';
import {default_ag_grid_col_def} from '../../shared/definition/grid-def';
import {AG_GRID_LOCALE_ZH} from '../../shared/locale.zh';
import {AgGridAngular} from 'ag-grid-angular';
import {environment} from '../../../environments/environment';
import {VendorService} from '../../shared/http-services/vendor.service';
import {JWTTokenService} from '../../shared/http-services/jwt-token.service';
import {MatDialog} from '@angular/material/dialog';
import {WorkService} from '../../shared/http-services/work.service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {asISODate, yearBeginning} from '../../shared/util/date-calc';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-historical-instock-record-list',
  templateUrl: './historical-instock-record-list.component.html',
  styleUrls: ['./historical-instock-record-list.component.scss']
})
export class HistoricalInstockRecordListComponent implements OnInit {
  start: string = asISODate(yearBeginning())
  end: string = asISODate(new Date())

// grid 必备 fields
  public ColumnDefs: ColDef[] = instock_record_col_def
  public defaultColDef: ColDef = default_ag_grid_col_def

  public localeText: {
    [key: string]: string;
  } = AG_GRID_LOCALE_ZH;

  public gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;

  public rowData!: any[]

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(
    public vendorService: VendorService,
    public jwtTokenService: JWTTokenService,
    private dialog: MatDialog,
    private workService: WorkService,
    private http: HttpClient,
    public _snackBar: MatSnackBar
  ) { }


  ngOnInit(): void {
    this.start = asISODate(yearBeginning());
    this.end = asISODate(new Date());
  }

  onBtnExport() {
    this.http.get(
      `${environment.API_URL}/instock/instock-record-in-excel?start=${this.start}&end=${this.end}`,
      {responseType: 'blob'})
      .subscribe({
        next: blob => {
          saveAs(blob, `入库记录 ${this.start}-${this.end}.xlsx`);
        },
        error: error => console.log(error)
      });
  }

  // 以下为grid 必备函数

  updateGridData(): void {
    this.http
      .get<any[]>(`${environment.API_URL}/instock/records-in-date-range?start=${this.start}&end=${this.end}`)
      .subscribe({
      next: (response) => {
        this.rowData = response;
        this.autoSizeAll(false);
      },
      error: (err) => {alert(err)}
    })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.updateGridData();
  }

  autoSizeAll(skipHeader: boolean) {
    const allColumnIds: string[] = [];
    this.gridColumnApi.getColumns()!.forEach((column) => {
      allColumnIds.push(column.getId());
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

}
