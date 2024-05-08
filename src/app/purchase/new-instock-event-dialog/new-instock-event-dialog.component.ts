import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {VendorService} from '../../shared/http-services/vendor.service';
import {JWTTokenService} from '../../shared/http-services/jwt-token.service';
import {WorkService} from '../../shared/http-services/work.service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {instock_detail_col_def, instock_item_col_def, InstockForm, InstockItem} from '../../shared/models/instock';
import {FormBuilder} from '@angular/forms';
import {CellEditingStoppedEvent, ColDef, ColumnApi, GridApi, GridReadyEvent} from 'ag-grid-community';
import {default_ag_grid_col_def} from '../../shared/definition/grid-def';
import {AG_GRID_LOCALE_ZH} from '../../shared/locale.zh';
import {AgGridAngular} from 'ag-grid-angular';

class InstockEventDialogData {
  instock_form: InstockForm | undefined
  instock_item: InstockItem | undefined
}

@Component({
  selector: 'app-new-instock-event-dialog',
  templateUrl: './new-instock-event-dialog.component.html',
  styleUrls: ['./new-instock-event-dialog.component.scss']
})
export class NewInstockEventDialogComponent implements OnInit {
  public form_id: number
  public company: string
  // grid 必备 fields
  public ColumnDefs: ColDef[] = instock_detail_col_def
  public defaultColDef: ColDef = default_ag_grid_col_def

  public localeText: {
    [key: string]: string;
  } = AG_GRID_LOCALE_ZH;

  private gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;

  public rowData!: InstockItem[]
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(
    public dialogRef: MatDialogRef<NewInstockEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InstockEventDialogData,
    public vendorService: VendorService,
    public jwtTokenService: JWTTokenService,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form_id = this.data.instock_form ? this.data.instock_form.form_id : this.data.instock_item.form_id;
    this.company = this.data.instock_form ? this.data.instock_form.vendor.company : this.data.instock_item.display.company
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowData = this.data.instock_form ? this.data.instock_form.instock_item : [this.data.instock_item];
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
    if (!!this.data.instock_form) {
      const updated_form = {...this.data.instock_form, instock_item: this.rowData}
      this.dialogRef.close(updated_form)
    } else {
      console.log(this.gridApi.getRenderedNodes())
      this.dialogRef.close(this.gridApi.getRenderedNodes()[0].data)
    }

  }

}
