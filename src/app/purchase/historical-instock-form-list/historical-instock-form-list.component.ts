import {Component, ViewChild} from '@angular/core';
import {Vendor} from '../../shared/models/vendor';
import {ColDef, ColumnApi, GridApi, GridReadyEvent, RowClassRules} from 'ag-grid-community';
import {instock_form_col_def, InstockForm} from '../../shared/models/instock';
import {default_ag_grid_col_def} from '../../shared/definition/grid-def';
import {AG_GRID_LOCALE_ZH} from '../../shared/locale.zh';
import {AgGridAngular} from 'ag-grid-angular';
import {VendorService} from '../../shared/http-services/vendor.service';
import {JWTTokenService} from '../../shared/http-services/jwt-token.service';
import {MatDialog} from '@angular/material/dialog';
import {WorkService} from '../../shared/http-services/work.service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {environment} from '../../../environments/environment';
import {autoFadeSnackBar} from '../../shared/util/notifications';

@Component({
  selector: 'app-historical-instock-form-list',
  templateUrl: './historical-instock-form-list.component.html',
  styleUrls: ['./historical-instock-form-list.component.scss']
})
export class HistoricalInstockFormListComponent {
  // grid 必备 fields
  public ColumnDefs: ColDef[] = instock_form_col_def
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
    this.http
      .get<any[]>(`${environment.API_URL}/instock/historical-form`).subscribe({
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

  ifAnyRowSelected() {
    if (!this.gridApi) {
      return true;
    }
    const rows = this.gridApi.getSelectedRows()
    if (!rows) {
      return true;
    } else {
      return rows.length === 0
    }
  }

  updateFormStatus(status: string) {
    // this.gridApi.getSelectedRows().forEach(form => {form.form_status = status});
    this.gridApi.getSelectedNodes().forEach(node => {node.setDataValue('form_status', status)});
    const forms_to_update = this.gridApi.getSelectedRows();
    // console.log(forms_to_update);
    this.http.put<InstockForm[]>(`${environment.API_URL}/instock/multiple-form`, forms_to_update).subscribe(
      {next: response => {
          autoFadeSnackBar(this._snackBar, '更新采购单信息', 3000)
        }}
    );
  }

  confirmFormPaid() {
    this.gridApi.getSelectedNodes().forEach(node => {node.setDataValue('paid', true)});
    const forms_to_update = this.gridApi.getSelectedRows();
    // console.log(forms_to_update);
    this.http.put<InstockForm[]>(`${environment.API_URL}/instock/multiple-form`, forms_to_update).subscribe(
      {next: response => {
          autoFadeSnackBar(this._snackBar,'更新采购单信息', 3000)
        }}
    );
  }

}
