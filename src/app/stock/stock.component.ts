import {Component, OnInit, ViewChild} from '@angular/core';
import {CompoService} from '../shared/http-services/compo.service';
import {compo_col_def,} from '../shared/models/compo';
import {FormBuilder} from '@angular/forms';
import {environment} from '../../environments/environment';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {JWTTokenService} from '../shared/http-services/jwt-token.service';
import {ActivatedRoute} from '@angular/router';
import {ColDef, ColumnApi, GridApi, GridReadyEvent, RowDoubleClickedEvent} from 'ag-grid-community';
import {default_ag_grid_col_def} from '../shared/definition/grid-def';
import {AG_GRID_LOCALE_ZH} from '../shared/locale.zh';
import {AgGridAngular} from 'ag-grid-angular';
import {HttpClient} from '@angular/common/http';
import {SpecListDialogComponent} from './spec-list-dialog/spec-list-dialog.component';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  loadingFlag = false;
  // grid 必备 fields
  public ColumnDefs: ColDef[] = compo_col_def;
  public defaultColDef: ColDef = default_ag_grid_col_def;
  public localeText: {
    [key: string]: string;
  } = AG_GRID_LOCALE_ZH;
  public gridApi!: GridApi;
  public rowData!: any[];
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  private warn_compo_id: string;
  private gridColumnApi!: ColumnApi;

  constructor(
    private compoService: CompoService,
    private formBuilder: FormBuilder,
    public _snackBar: MatSnackBar,
    public jwtTokenService: JWTTokenService,
    public route: ActivatedRoute,
    private http: HttpClient,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.warn_compo_id = this.route.snapshot.paramMap.get('warn_compo_id') || '';
  }

  // ngOnInit(): void {
  // this.warn_compo_id = this.route.snapshot.paramMap.get('warn_compo_id') || '';
  // this.loadingFlag = true;
  // this.compoService.getCompos().subscribe(
  //   res => {
  //     this.compos = res;
  //     this.compos.forEach(c => {
  //       c.total_stock = c.specification?.filter(spec => spec.hide === false).reduce((prev, curr, idx) => prev + curr.stock, 0);
  //     })
  //     this.displayCompos = this.compos;
  //     this.dangerousCompos = this.compos.filter(compo => compo.total_stock < compo.warn_stock);
  //     this.materials = this.compos.map(c => c.model).filter((v, idx, arr) => !!v && arr.indexOf(v) === idx);
  //     this.dataSource = new MatTableDataSource<Compo>(this.displayCompos);
  //     this.dataSource.paginator = this.paginator;
  //   },
  //   err => console.log(err),
  // () => this.loadingFlag = false
  // );

  // this.loadingFlag = true;
  // this.compoService.getCompoCategories().subscribe(
  //   res => this.categories = res,
  //   err => console.log(err),
  //   // () => this.loadingFlag = false
  // )
  //   this.filterGroup = this.formBuilder.group({
  //     keyword: new FormControl(''),
  //     material: new FormControl(null),
  //     category: new FormControl(null)
  //   });
  //
  //   this.filterGroup.valueChanges.subscribe(
  //     changes => {
  //       this.displayCompos = this.compoService.compoSearchFilter(this.compos, changes);
  //       this.dataSource = new MatTableDataSource<Compo>(this.displayCompos);
  //     }
  //   );
  //   if (this.warn_compo_id) {
  //     this.checkWarns();
  //   }
  // }
  //
  // ngAfterViewInit() {
  // }
  //
  // emptyFilter(): void {
  //   this.filterGroup.setValue({
  //     keyword: '',
  //     material: null,
  //     category: null,
  //   })
  //   this.displayCompos = this.compos;
  //   this.dataSource = new MatTableDataSource<Compo>(this.displayCompos);
  // }
  //
  // filterHiddenSpecs(specs: Spec[]): Spec[] {
  //   return specs.filter(spec => spec.hide === false);
  // }
  //
  // checkWarns(): void {
  //   this.displayCompos = this.compos.filter(compo => Number(compo.specification?.reduce((acc, spec) => acc + spec.stock, 0)) < compo.warn_stock);
  //   this.dataSource = new MatTableDataSource<Compo>(this.displayCompos);
  // }
  //
  // openEditCompoDialog(compo: Compo): void {
  //   const dialogRef = this.dialog.open(EditComponentDialogComponent, {
  //     width: environment.MEDIAN_DIALOG_WIDTH,
  //     data: {compo: compo}
  //   });
  //   dialogRef.afterClosed().subscribe(updated_compo => {
  //     if (!!updated_compo) {
  //       const idx1 = this.displayCompos.findIndex(c => c.id === updated_compo.id);
  //       this.displayCompos[idx1] = {...this.displayCompos[idx1], ...updated_compo};
  //       const idx2 = this.compos.findIndex(c => c.id === updated_compo.id);
  //       this.compos[idx2] = {...this.compos[idx2], ...updated_compo};
  //       this.dataSource = new MatTableDataSource<Compo>(this.displayCompos);
  //       this.dataSource.paginator = this.paginator;
  //       autoFadeSnackBar(this._snackBar, '修改配件母类成功', 3000)
  //     }
  //   });
  // }
  //
  // openHideCompoDialog(compo: Compo): void {
  //   const dialogRef = this.dialog.open(HideComponentDialogComponent, {
  //     width: environment.LARGE_DIALOG_WIDTH,
  //     data: {compo: compo}
  //   });
  //
  //   dialogRef.afterClosed().subscribe(res => {
  //     if (!!res) {
  //       const idx = this.dataSource.data.indexOf(compo);
  //       if (idx > -1) {
  //         this.dataSource.data.splice(idx, 1);
  //         this.dataSource._updateChangeSubscription();
  //         this.dataSource.paginator = this.paginator;
  //         autoFadeSnackBar(this._snackBar, `配件母类${compo.id}已隐藏`, 3000)
  //       }
  //     }
  //   });
  // }
  //
  // openEditSpecDialog(spec: Spec, compo: Compo): void {
  //   const dialogRef = this.dialog.open(EditSpecDialogComponent, {
  //     width: environment.SMALL_DIALOG_WIDTH,
  //     data: {spec: spec, compo_name: compo.name}
  //   });
  //
  //   dialogRef.afterClosed().subscribe(updated_spec => {
  //     if (updated_spec) {
  //       // find the target compo index
  //       const idx1 = this.dataSource.data.indexOf(compo)
  //       // find the target spec index in the compo
  //       const idx2 = compo.specification?.indexOf(spec);
  //       // @ts-ignore
  //       this.dataSource.data[idx1].specification[idx2] = updated_spec
  //       this.dataSource._updateChangeSubscription();
  //       this.dataSource.paginator = this.paginator;
  //       autoFadeSnackBar(this._snackBar, `修改配件规格${spec.id}成功`, 3000)
  //     }
  //   });
  // }
  //
  // openAddSpecDialog(compo: Compo) {
  //   const dialogRef = this.dialog.open(AddSpecDialogComponent, {
  //     width: environment.SMALL_DIALOG_WIDTH,
  //     data: {compo: compo, specs: compo.specification}
  //   });
  //
  //   dialogRef.afterClosed().subscribe(new_spec => {
  //     if (new_spec) {
  //       console.log(new_spec);
  //       const idx = this.dataSource.data.indexOf(compo);
  //       if (idx > -1) {
  //         this.dataSource.data[idx].specification.push(new_spec);
  //         this.dataSource._updateChangeSubscription();
  //         this.dataSource.paginator = this.paginator;
  //         autoFadeSnackBar(this._snackBar, '添加配件规格', 3000)
  //       }
  //     }
  //   });
  // }
  //
  // openHideSpecDialog(spec: Spec, compo: Compo) {
  //   console.log(spec, compo);
  //   const dialogRef = this.dialog.open(HideSpecConfirmDialogComponent, {
  //     width: environment.LARGE_DIALOG_WIDTH,
  //     data: {spec: spec, compo: compo}
  //   });
  //
  //   dialogRef.afterClosed().subscribe(res => {
  //     if (!!res) {
  //       const idx1 = this.dataSource.data.indexOf(compo);
  //       const idx2 = compo.specification?.indexOf(spec);
  //       if (idx1 > -1) {
  //         if (idx2 != null) {
  //           this.dataSource.data[idx1].specification.splice(idx2, 1);
  //         }
  //         this.dataSource._updateChangeSubscription();
  //         this.dataSource.paginator = this.paginator;
  //         autoFadeSnackBar(this._snackBar, '配件规格隐藏成功', 3000)
  //       }
  //     }
  //   });
  // }
  //
  // openShowPictureDialog(compo_id: any | undefined) {
  //   const dialogRef = this.dialog.open(ShowPictureDialogComponent, {
  //     width: environment.LARGE_DIALOG_WIDTH,
  //     height: '80%',
  //     data: {key: compo_id}
  //   });
  // }
  //
  // openUploadPictureDialog(compo_id: any | undefined, compo_name: any | undefined) {
  //   const dialogRef = this.dialog.open(UploadPictureDialogComponent, {
  //     width: environment.SMALL_DIALOG_WIDTH,
  //     height: '30%',
  //     data: {key: compo_id, display_name: compo_name}
  //   });
  // }

  // 以下为grid 必备函数

  getRowStyle = params => {
    if (params.node.data.total_stock <= params.node.data.warn_stock) {
      return {
        fontWeight: 'bold',
        background: '#EF9A9A'
      };
    } else {
      return {};
    }
  };

  updateGridData(): void {
    this.loadingFlag = true;
    let default_filter_model = {
      hide: {
        filterType: 'text',
        type: 'notEqual',
        filter: 'true'
      }
    };
    if (this.warn_compo_id && Object.keys(this.gridApi.getFilterModel()).length == 0) {
      default_filter_model['id'] = {
        filterType: 'text',
        type: 'equals',
        filter: this.warn_compo_id
      }
    }
    this.http
      .get<any[]>(`${environment.API_URL}/components`).subscribe({
      next: (response) => {
        this.rowData = response;
        this.gridApi.setFilterModel(default_filter_model);
        this.autoSizeAll(false);
      },
      error: (err) => {
        alert(err);
      },
      complete: () => {
        this.loadingFlag = false;
      }
    });
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

  onCompoRowDoubleClicked($event: RowDoubleClickedEvent<any>) {
    const dialogRef = this.dialog.open(SpecListDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      width: environment.LARGE_DIALOG_WIDTH,
      height: '80%',
      data: $event.data
    });
    dialogRef.afterClosed().subscribe({
      next: (specifications) => {
        $event.node.setDataValue('specification', specifications);
      }
    });
  }

  showFilter() {
    console.log(this.gridApi.getFilterModel());
  }
}
