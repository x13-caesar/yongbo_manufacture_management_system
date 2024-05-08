import {Component, Inject, ViewChild} from '@angular/core';
import {ColDef, ColumnApi, GridApi, GridReadyEvent, RowClassRules, RowDoubleClickedEvent, RowEditingStoppedEvent} from 'ag-grid-community';
import {instock_record_col_def, InstockRecord} from '../../shared/models/instock';
import {default_ag_grid_col_def} from '../../shared/definition/grid-def';
import {AG_GRID_LOCALE_ZH} from '../../shared/locale.zh';
import {AgGridAngular} from 'ag-grid-angular';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {VendorService} from '../../shared/http-services/vendor.service';
import {JWTTokenService} from '../../shared/http-services/jwt-token.service';
import {WorkService} from '../../shared/http-services/work.service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Compo} from '../../shared/models/compo';
import {environment} from '../../../environments/environment';
import {Spec, spec_col_def} from '../../shared/models/spec';

@Component({
  selector: 'app-spec-list-dialog',
  templateUrl: './spec-list-dialog.component.html',
  styleUrls: ['./spec-list-dialog.component.scss']
})
export class SpecListDialogComponent {
  public editType: 'fullRow' = 'fullRow';

  // grid 必备 fields
  public ColumnDefs: ColDef[] = spec_col_def
  public defaultColDef: ColDef = default_ag_grid_col_def

  public localeText: {
    [key: string]: string;
  } = AG_GRID_LOCALE_ZH;

  public gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;

  public rowData!: Spec[]

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(
    public dialogRef: MatDialogRef<SpecListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Compo,
    public vendorService: VendorService,
    public jwtTokenService: JWTTokenService,
    private workService: WorkService,
    private http: HttpClient,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.rowData = this.data.specification || [];
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
    this.http.get(`${environment.API_URL}/specifications/component_id/${this.data.id}`)
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    if (!!this.rowData) {
      this.updateGridData();
    }
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

  handleSpecUpdate($event: RowEditingStoppedEvent) {
    console.log($event.data);
    this.http.put(`${environment.API_URL}/specifications`, $event.data).subscribe(
      {
        next: (response) => {
          $event.node.updateData(response);
          },
        error: (err) => {alert(err.message)}
      }
    )
  }

  onCompleteClick() {
    this.dialogRef.close(this.rowData);
  }

  onRowDoubleClicked($event: RowDoubleClickedEvent<any>) {
  }
}
