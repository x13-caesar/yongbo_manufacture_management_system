import {Component, Inject, ViewChild} from '@angular/core';
import {Vendor} from '../../shared/models/vendor';
import {ColDef, ColumnApi, GridApi, GridReadyEvent, RowClassRules} from 'ag-grid-community';
import {instock_form_col_def, instock_record_col_def, InstockForm, InstockRecord} from '../../shared/models/instock';
import {default_ag_grid_col_def} from '../../shared/definition/grid-def';
import {AG_GRID_LOCALE_ZH} from '../../shared/locale.zh';
import {AgGridAngular} from 'ag-grid-angular';
import {VendorService} from '../../shared/http-services/vendor.service';
import {JWTTokenService} from '../../shared/http-services/jwt-token.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {WorkService} from '../../shared/http-services/work.service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {environment} from '../../../environments/environment';

class InstockRecordDialogData {
  instock_form_id: number
  instock_item_id: number
}

@Component({
  selector: 'app-instock-record-view-dialog',
  templateUrl: './instock-record-view-dialog.component.html',
  styleUrls: ['./instock-record-view-dialog.component.scss']
})
export class InstockRecordViewDialogComponent {
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
    public dialogRef: MatDialogRef<InstockRecordViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InstockRecordDialogData,
    public vendorService: VendorService,
    public jwtTokenService: JWTTokenService,
    private workService: WorkService,
    private http: HttpClient,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  // 以下为grid 必备函数

  rowClassRules: RowClassRules = {
    'row-finished-and-paid': (params) => {
      return params.data.form_status === 'finished' && !!params.data.paid;
    },
    'row-finished': (params) => {
      return params.data.form_status === 'finished';
    },
    'row-cancelled': (params) => {
      return params.data.form_status === 'cancelled'
    }
  };

  updateGridData(): void {
    const criteria = this.data.instock_form_id ? 'instock_form_id=' + String(this.data.instock_form_id) : 'instock_item_id=' + String(this.data.instock_item_id)
    this.http
      .get<InstockRecord[]>(`${environment.API_URL}/instock/record?${criteria}`).subscribe({
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

  autoFadeSnackBar(text: string, timeout: number) {
    this._snackBar.open(text, "关闭");
    setTimeout(() => this._snackBar.dismiss(), timeout);
  }
}
