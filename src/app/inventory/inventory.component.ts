import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Product} from '../shared/models/product';
import {ProductService} from '../shared/http-services/product.service';
import {Observable} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {CreateWorkDialogComponent} from '../manufacture/create-work-dialog/create-work-dialog.component';
import {environment} from '../../environments/environment';
import {CreateDeliveryDialogComponent} from '../delivery/create-delivery-dialog/create-delivery-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Compo} from '../shared/models/compo';
import {EditProductDialogComponent} from './edit-product-dialog/edit-product-dialog.component';
import {JWTTokenService} from '../shared/http-services/jwt-token.service';
import {CopyProductDialogComponent} from './copy-product-dialog/copy-product-dialog.component';
import {ConfirmDeprecateDialogComponent} from './confirm-deprecate-dialog/confirm-deprecate-dialog.component';
import {ShowPictureDialogComponent} from '../show-picture-dialog/show-picture-dialog.component';
import {Environment} from '@angular/compiler-cli/src/ngtsc/typecheck/src/environment';
import {UploadPictureDialogComponent} from '../upload-picture-dialog/upload-picture-dialog.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  loadingFlag: boolean = false;

  displayedProperties: string[] = [
    'id', 'name', 'category', 'description',
    'inventory', 'custom', 'notice', 'picture',
    'edit'
  ];

  displayedColumns = new Map([['id', '产品编码'], ['name','产品名称'],
    ['category', '分类'], ['description', '描述'], ['inventory', '库存'], ['custom', '定制客户'], ['notice', '备注'], ['picture', '图片'],
    ['edit', '操作']]);

  products: Product[] = []
  displayProducts: Product[] = []
  dataSource: any

  filterGroup!: FormGroup;
  categories: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public jwtTokenService: JWTTokenService,
    private productService: ProductService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadingFlag = true;
    this.productService.getValidProducts().subscribe(
      res => {
        this.products = res;
        this.displayProducts = this.products;
        this.categories = res.map(prod => prod.category).filter((v, idx, arr) => !!v && arr.indexOf(v) === idx);
        this.dataSource = new MatTableDataSource<Product>(this.displayProducts);
        this.dataSource.paginator = this.paginator;
        this.loadingFlag = false;
      },
      error => {
        console.log(error);
        this.loadingFlag = false;
      },
    )
    this.filterGroup = this.formBuilder.group({
      keyword: new FormControl(''),
      material: new FormControl(null),
      category: new FormControl(null)
    })
    this.filterGroup.valueChanges.subscribe(
      changes => {
        this.displayProducts = this.productService.productSearchFilter(this.products, changes)
        this.dataSource = new MatTableDataSource<Product>(this.displayProducts);
      }
    )
  }

  emptyFilter(): void {
    this.filterGroup.setValue({
      keyword: '',
      material: null,
      category: null
    })
    this.displayProducts = this.products;
    this.dataSource = new MatTableDataSource<Product>(this.displayProducts);
  }

  openCreateDeliveryDialog(product: Product) {
    const dialogRef = this.dialog.open(CreateDeliveryDialogComponent, {
      width: environment.SMALL_DIALOG_WIDTH,
      data: {product: product}
    });

    dialogRef.afterClosed().subscribe(
      new_delivery => new_delivery && this.onSuccess('新增交付记录')
    );
  }

  openEditProductDialog(product: Product) {
    const dialogRef = this.dialog.open(EditProductDialogComponent, {
      width: environment.LARGE_DIALOG_WIDTH,
      data: {product: product}
    });

    dialogRef.afterClosed().subscribe(
      res => {
        const targetIdx1 = this.products.findIndex(prod => prod.id === res.id);
        const targetIdx2 = this.displayProducts.findIndex(prod => prod.id === res.id);
        this.products[targetIdx1] = res;
        this.displayProducts[targetIdx2] = res;
        this.dataSource = new MatTableDataSource<Product>(this.displayProducts);
        this.onSuccess('编辑')
      }
    )
  }

  onSuccess(eventString: string): void {
    this._snackBar.open(`${eventString}成功`, "关闭");
  }

  onFailure(eventString: string): void {
    this._snackBar.open(`${eventString}失败`, "关闭");
  }


  openCopyProductDialog(product: Product) {
    const dialogRef = this.dialog.open(CopyProductDialogComponent, {
      width: '30%',
      height: '30%',
      data: {product: product}
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.products.push(res);
          this.displayProducts.push(res)
          this.dataSource = new MatTableDataSource<Product>(this.displayProducts);
          this.onSuccess('复制')
        }})}


  openDeprecateConfirmDialog(product: Product) {
    const dialogRef = this.dialog.open(ConfirmDeprecateDialogComponent, {
      width: '30%',
      height: '30%',
      data: {product: product}
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (!!res) {
          const idx = this.dataSource.data.indexOf(product);
          if (idx > -1) {
            this.dataSource.data.splice(idx, 1);
            this.dataSource._updateChangeSubscription();
            this.dataSource.paginator = this.paginator;
            this.onSuccess('停用');
          }
        }
      }
    )
  }

  openShowPictureDialog(product_id: string) {
    const dialogRef = this.dialog.open(ShowPictureDialogComponent, {
      width: environment.LARGE_DIALOG_WIDTH,
      height: '80%',
      data: {key: product_id}
    });
  }

  openUploadPictureDialog(product_id: string, product_name: string) {
    const dialogRef = this.dialog.open(UploadPictureDialogComponent, {
      width: environment.SMALL_DIALOG_WIDTH,
      height: '30%',
      data: {key: product_id, display_name: product_name}
    });
  }
}
