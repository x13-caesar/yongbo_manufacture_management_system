import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Vendor, vendor_col_def} from '../shared/models/vendor';
import {VendorService} from '../shared/http-services/vendor.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {CreateVendorDialogComponent} from './create-vendor-dialog/create-vendor-dialog.component';
import {environment} from '../../environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatPaginator} from '@angular/material/paginator';
import {FormControl, FormGroup} from '@angular/forms';
import {JWTTokenService} from '../shared/http-services/jwt-token.service';
import {ColDef, ColumnApi, GridApi, GridReadyEvent, RowClassRules, RowEditingStoppedEvent} from 'ag-grid-community';
import {default_ag_grid_col_def} from '../shared/definition/grid-def';
import {AG_GRID_LOCALE_ZH} from '../shared/locale.zh';
import {Observable} from 'rxjs';
import {AgGridAngular} from 'ag-grid-angular';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit {
  displayedProperties: string[] = [
    'id', 'name', 'company', 'payment_period',
    'contact', 'address', 'notice', 'edit'
  ];

  displayedColumns = new Map([['id', '供应商编号'], ['name','联络人姓名'], ['address', '地址'],
    ['company', '公司'], ['payment_period', '账期'], ['contact', '联系方式'], ['notice', '备注'],
    ['edit', '操作']]);

  searchKeyword = new FormControl('')
  vendors: Vendor[] = [];
  dataSource: any;

  // @ViewChild(MatPaginator) paginator!: MatPaginator;

  // grid 必备 fields
  public ColumnDefs: ColDef[] = vendor_col_def
  public defaultColDef: ColDef = default_ag_grid_col_def

  public localeText: {
    [key: string]: string;
  } = AG_GRID_LOCALE_ZH;

  public gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;

  public rowData$!: Observable<any[]>

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(
    public jwtTokenService: JWTTokenService,
    public vendorService: VendorService,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    public http: HttpClient,
  ) { }

  ngOnInit(): void {
    // this.vendorService.getVendors().subscribe(
    //   res => {
    //     this.vendors = res;
    //     this.dataSource = new MatTableDataSource<Vendor>(this.vendors);
    //     this.dataSource.paginator = this.paginator;
    //   },
    //   error => console.log(error)
    // );
    // this.searchKeyword.valueChanges.subscribe(
    //   kw => {
    //     this.dataSource = new MatTableDataSource<Vendor>(this.vendorService.vendorSearchFilter(this.vendors, kw || ''));
    //     this.dataSource.paginator = this.paginator;
    //   })
  }

  openCreateVendorDialog(): void {
    const dialogRef = this.dialog.open(CreateVendorDialogComponent, {
      width: environment.MEDIAN_DIALOG_WIDTH
    });

    dialogRef.afterClosed().subscribe(new_vendor => {
      if (new_vendor) {
        this.dataSource.data.push(new_vendor);
        this.dataSource._updateChangeSubscription();
        // this.dataSource.paginator = this.paginator;
        this._snackBar.open("新供应商创建成功", "关闭")
      }
    });
  }

  onVendorSubmit(vendor: Vendor): void {
    this.vendorService.putVendor(vendor).subscribe(
      res => this.onSuccess('修改供应商'),
      error => this.onFailure('修改供应商')
    )
  }

  onVendorDelete(vendor: Vendor): void {
    this.vendorService.deleteVendor(Number(vendor.id)).subscribe(
      res => {
        const target = this.vendors.findIndex(v => v.id === vendor.id);
        if (target > -1) {
          this.vendors.splice(target, 1);
          this.dataSource = new MatTableDataSource<Vendor>(this.vendors);
        }
        this.onSuccess('删除供应商');
      },
      error => this.onFailure('删除供应商')
    )
  }

  onSuccess(eventString: string): void {
    this._snackBar.open(`${eventString}成功`, "关闭");
  }

  onFailure(eventString: string): void {
    this._snackBar.open(`${eventString}失败`, "关闭");
  }

  // 以下为grid 必备函数

  updateGridData(): void {
    this.rowData$ = this.http.get<Vendor[]>(`${environment.API_URL}/vendors`)
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.updateGridData();
    this.gridApi.sizeColumnsToFit();
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

  onRowEditingStopped($event: RowEditingStoppedEvent<any>) {
    this.vendorService.putVendor($event.data).subscribe(
      {
        next: res => {
          console.log(res);
          $event.node.setData(res);
          this.autoFadeSnackBar("修改供应商信息成功", 3000);
        },
        error: error => {
          alert(error.message);
        }
      }
    )
  }

  autoFadeSnackBar(text: string, timeout: number) {
    this._snackBar.open(text, "关闭");
    setTimeout(() => this._snackBar.dismiss(), timeout);
  }

}
