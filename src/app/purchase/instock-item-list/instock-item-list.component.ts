import {Component, ViewChild} from '@angular/core';
import {CellValueChangedEvent, ColDef, ColumnApi, GridApi, GridReadyEvent, RowClassRules, RowValueChangedEvent} from 'ag-grid-community';
import {instock_item_col_def, InstockForm, InstockItem} from '../../shared/models/instock';
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
import {Vendor} from '../../shared/models/vendor';
import {autoFadeSnackBar} from '../../shared/util/notifications';

@Component({
  selector: 'app-instock-item-list',
  templateUrl: './instock-item-list.component.html',
  styleUrls: ['./instock-item-list.component.scss']
})
export class InstockItemListComponent {
  vendors: Vendor[] = [];

  // grid 必备 fields
  public ColumnDefs: ColDef[] = instock_item_col_def
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
    this.vendorService.getVendors().subscribe(
      {next: res => this.vendors = res,
        error: error => console.log(error)
      }
    );
  }

  // 以下为grid 必备函数

  getRowStyle = params => {
      const today = new Date()
      const plan_date = new Date(params.data.instock_date)
      const diffDays = Math.round((plan_date.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
      if (diffDays < 0) {
        return {
          fontWeight: "bold",
          background: "#FFEBEE"
      }
      } else if (diffDays < 10) {
        return {
          background: "#FFF3E0"
        }
      } else {
        return {
          background: "#efffed"
        }
      }
  };

  updateGridData(): void {
    this.http
      .get<any[]>(`${environment.API_URL}/instock/ongoing-item`).subscribe({
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


  onInstockItemValueChanged($event: CellValueChangedEvent<any>) {
    let field = $event.colDef.field;
    let submit_instock_item = {...$event.data};
    submit_instock_item[field] = $event.newValue;
    this.http.put<InstockItem>(`${environment.API_URL}/instock/item`, submit_instock_item).subscribe({
        next: (updated_item) => {
          autoFadeSnackBar(this._snackBar, "更新成功", 3000)
          $event.node.setData(updated_item);
        }}
      )
  }
}
