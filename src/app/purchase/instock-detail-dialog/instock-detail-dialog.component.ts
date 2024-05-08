import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {InstockForm, instock_form_col_def, InstockItem, instock_item_col_def, instock_detail_col_def} from '../../shared/models/instock';
import {ColDef, ColumnApi, GridApi, GridReadyEvent} from 'ag-grid-community';
import {default_ag_grid_col_def} from '../../shared/definition/grid-def';
import {AG_GRID_LOCALE_ZH} from '../../shared/locale.zh';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AgGridAngular} from 'ag-grid-angular';

class InstockDetailDialogData {
  instock_form?: InstockForm;
  instock_form_id?: number;
}

@Component({
  selector: 'app-instock-detail-dialog',
  templateUrl: './instock-detail-dialog.component.html',
  styleUrls: ['./instock-detail-dialog.component.scss']
})
export class InstockDetailDialogComponent {
  // grid 必备 fields
  public ColumnDefs: ColDef[] = instock_item_col_def.slice(0,-1)
  public defaultColDef: ColDef = default_ag_grid_col_def

  public localeText: {
    [key: string]: string;
  } = AG_GRID_LOCALE_ZH;

  private gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;

  public rowData!: InstockItem[]
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(
    public dialogRef: MatDialogRef<InstockDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InstockDetailDialogData,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    if (!!this.data.instock_form_id) {
      this.http.get(`${environment.API_URL}/instock/form?form_id=${this.data.instock_form_id}`).subscribe(
        {
          next: (res) => {
            this.data.instock_form = res[0];
            this.autoSizeAll(false);
          },
          error: (err) => {
            alert(err.message)
          }
        }
      )
    } else {
      this.data.instock_form_id = this.data.instock_form.form_id
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowData = this.data.instock_form.instock_item;
    this.autoSizeAll(false);
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


  onCompleteClick() {
    const updated_form = {...this.data.instock_form, instock_item: this.rowData}
    this.dialogRef.close(updated_form)
  }
}
