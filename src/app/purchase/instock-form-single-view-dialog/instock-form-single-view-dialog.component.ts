import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {VendorService} from '../../shared/http-services/vendor.service';
import {JWTTokenService} from '../../shared/http-services/jwt-token.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {instock_form_single_view_col_def, instock_record_col_def, InstockForm, InstockRecord} from '../../shared/models/instock';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {PurchaseInfo} from '../../shared/models/purchase-info';
import {ColDef, ColumnApi, GridApi, GridReadyEvent} from 'ag-grid-community';
import {default_ag_grid_col_def} from '../../shared/definition/grid-def';
import {AG_GRID_LOCALE_ZH} from '../../shared/locale.zh';
import {AgGridAngular} from 'ag-grid-angular';

@Component({
  selector: 'app-instock-form-single-view-dialog',
  templateUrl: './instock-form-single-view-dialog.component.html',
  styleUrls: ['./instock-form-single-view-dialog.component.scss']
})
export class InstockFormSingleViewDialogComponent {
  public instock_form!: InstockForm

  // grid 必备 fields
  public ColumnDefs: ColDef[] = instock_form_single_view_col_def
  public defaultColDef: ColDef = default_ag_grid_col_def

  public localeText: {
    [key: string]: string;
  } = AG_GRID_LOCALE_ZH;

  public gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;

  public rowData!: any[]

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(
    public dialogRef: MatDialogRef<InstockFormSingleViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {instock_form_id: number},
    public vendorService: VendorService,
    public http: HttpClient,
    public jwtTokenService: JWTTokenService,
    public _snackBar: MatSnackBar
  ) { }

  onCompleteClick() {
  }

  autoSizeAll(skipHeader: boolean) {
    const allColumnIds: string[] = [];
    this.gridColumnApi.getColumns()!.forEach((column) => {
      allColumnIds.push(column.getId());
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  updateGridData(): void {
    this.http
      .get<InstockForm>(`${environment.API_URL}/instock/form-as-preview?form_id=${this.data.instock_form_id}`).subscribe({
      next: (response) => {
        this.instock_form = response;
        this.rowData = response.instock_item;
        this.autoSizeAll(false);
      },
      error: (err) => {
        alert(err.message);
        console.log(err);
      }
    })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.updateGridData();
  }

}
