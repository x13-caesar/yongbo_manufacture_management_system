import {Component, OnInit, ViewChild} from '@angular/core';
import {JWTTokenService} from '../shared/http-services/jwt-token.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {OperationService} from '../shared/http-services/operation.service';
import {ColDef, ColumnApi, GridApi, GridReadyEvent, RowClassRules} from 'ag-grid-community';
import {default_ag_grid_col_def} from '../shared/definition/grid-def';
import {AG_GRID_LOCALE_ZH} from '../shared/locale.zh';
import {AgGridAngular} from 'ag-grid-angular';
import {operation_col_def} from '../shared/models/operation';

@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.scss']
})
export class OperationComponent implements OnInit {
// grid 必备 fields
  public ColumnDefs: ColDef[] = operation_col_def
  public defaultColDef: ColDef = default_ag_grid_col_def

  public localeText: {
    [key: string]: string;
  } = AG_GRID_LOCALE_ZH;

  public gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;

  public rowData!: any[]

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(
    public jwtTokenService: JWTTokenService,
    private operationService: OperationService,
    public dialog: MatDialog,
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
    this.operationService.getAllOperations().subscribe({
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

  ngOnInit(): void {
  }
}
