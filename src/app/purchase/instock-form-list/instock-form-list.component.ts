import {Component, ViewChild} from '@angular/core';
import {CellValueChangedEvent, ColDef, ColumnApi, GridApi, GridReadyEvent, RowClassRules} from 'ag-grid-community';
import {default_ag_grid_col_def} from '../../shared/definition/grid-def';
import {AG_GRID_LOCALE_ZH} from '../../shared/locale.zh';
import {AgGridAngular} from 'ag-grid-angular';
import {JWTTokenService} from '../../shared/http-services/jwt-token.service';
import {MatDialog} from '@angular/material/dialog';
import {WorkService} from '../../shared/http-services/work.service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {environment} from '../../../environments/environment';
import {instock_form_col_def, InstockForm} from '../../shared/models/instock';
import {VendorService} from '../../shared/http-services/vendor.service';
import {autoFadeSnackBar} from '../../shared/util/notifications';

@Component({
  selector: 'app-purchase',
  templateUrl: './instock-form-list.component.html',
  styleUrls: ['./instock-form-list.component.scss']
})
export class InstockFormListComponent {
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
      .get<any[]>(`${environment.API_URL}/instock/form?form_status=ongoing`).subscribe({
      next: (response) => {
        this.rowData = response;
        this.autoSizeAll(false);
        this.gridColumnApi.applyColumnState({
          state: [
            { colId: 'instock_date', sort: 'asc'},
          ],
          defaultState: {sort: null}
        })
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

  handlePaidChange(form_id: number, paid: boolean) {
    this.http.put<any>(`${environment.API_URL}/instock/change-form-paid?form_id=${form_id}&paid=${paid ? 'true' : 'false'}`, null).subscribe({
      next: (res) => {
        if (res['success'] === true) {
          autoFadeSnackBar(this._snackBar, `成功修改采购单状态`, 3000)
      }
    },
      error: (err) => {alert(err);}
    });
  }

  onCellValueChanged($event: CellValueChangedEvent<any>) {
    const paid = $event.newValue;
    const form_id = $event.data['form_id'];
    this.handlePaidChange(form_id, paid);
  }
}
