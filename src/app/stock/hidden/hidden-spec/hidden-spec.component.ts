import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {environment} from '../../../../environments/environment';
import {JWTTokenService} from '../../../shared/http-services/jwt-token.service';
import {ActivatedRoute} from '@angular/router';
import {Spec} from '../../../shared/models/spec';
import {SpecService} from '../../../shared/http-services/spec.service';
import {UnhideSpecDialogComponent} from '../unhide-spec-dialog/unhide-spec-dialog.component';
import {CompoService} from '../../../shared/http-services/compo.service';
import {Compo} from '../../../shared/models/compo';

@Component({
  selector: 'app-hidden-spec',
  templateUrl: './hidden-spec.component.html',
  styleUrls: ['./hidden-spec.component.scss']
})
export class HiddenSpecComponent implements OnInit {
  displayedProperties: string[] = [
    'id', 'component_name', 'vendor_company', 'gross_price', 'net_price', 'stock', 'blueprint', 'notice', 'edit'
  ];

  displayedColumns = new Map([['id', '配件子类规格码'], ['component_name','对应配件母类'],
    ['vendor_company', '供应商'], ['gross_price', '含税价'], ['net_price', '不含税价格'], ['stock', '库存'], ['blueprint', '图纸'], ['notice', '备注'],
    ['edit', '操作']]);


  searchKeyword = new FormControl('')
  specs: Spec[] = [];
  compos: Compo[] = [];
  dataSource: any;

  filterGroup!: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private specService: SpecService,
    private compoService: CompoService,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    public jwtTokenService: JWTTokenService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.compoService.getCompos().subscribe(res => {
      this.compos = res;
      this.compos.forEach(compo => compo.specification?.forEach(spec => {
        if (!!spec.hide) {
          this.specs.push({...spec, component_name: compo.name, vendor_company: spec.vendor?.company});
        }
      }))
      this.dataSource = new MatTableDataSource<Spec>(this.specs);
      this.dataSource.paginator = this.paginator;
    })
    this.searchKeyword.valueChanges.subscribe(
      kw => {
        this.dataSource = new MatTableDataSource<Spec>(this.specService.specSearchFilter(this.specs, kw));
        this.dataSource.paginator = this.paginator;
      })
  }

  ngAfterViewInit() {
  }

  emptyFilter(): void {
    this.filterGroup.setValue({
      keyword: ''
    })
    this.dataSource = new MatTableDataSource<Spec>(this.specs);
  }

  openUnhideSpecDialog(spec: Spec): void {
    const dialogRef = this.dialog.open(UnhideSpecDialogComponent, {
      width: environment.LARGE_DIALOG_WIDTH,
      data: {
        spec: spec,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        const idx = this.dataSource.data.indexOf(spec);
        if (idx > -1) {
          this.dataSource.data.splice(idx, 1);
          this.dataSource._updateChangeSubscription();
          this.dataSource.paginator = this.paginator;
          this._snackBar.open("子类规格已重新显示", "关闭")
        }
      }})
  }
}
