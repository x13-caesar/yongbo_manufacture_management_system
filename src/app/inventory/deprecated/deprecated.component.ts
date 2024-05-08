import {Component, OnInit, ViewChild} from '@angular/core';
import {Product} from '../../shared/models/product';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {JWTTokenService} from '../../shared/http-services/jwt-token.service';
import {ProductService} from '../../shared/http-services/product.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {CreateDeliveryDialogComponent} from '../../delivery/create-delivery-dialog/create-delivery-dialog.component';
import {environment} from '../../../environments/environment';
import {EditProductDialogComponent} from '../edit-product-dialog/edit-product-dialog.component';
import {CopyProductDialogComponent} from '../copy-product-dialog/copy-product-dialog.component';
import {ConfirmDeprecateDialogComponent} from '../confirm-deprecate-dialog/confirm-deprecate-dialog.component';

@Component({
  selector: 'app-deprecated',
  templateUrl: './deprecated.component.html',
  styleUrls: ['./deprecated.component.scss']
})
export class DeprecatedComponent implements OnInit {

  displayedProperties: string[] = [
    'id', 'name', 'category', 'description',
    'inventory', 'custom', 'notice', 'deprecated_date',
    'edit'
  ];

  displayedColumns = new Map([['id', '产品编码'], ['name','产品名称'],
    ['category', '分类'], ['description', '描述'], ['inventory', '库存'], ['custom', '定制客户'], ['notice', '备注'],
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
    this.productService.getInvalidProducts().subscribe(
      res => {
        this.products = res;
        this.displayProducts = this.products;
        this.categories = res.map(prod => prod.category).filter((v, idx, arr) => !!v && arr.indexOf(v) === idx);
        this.dataSource = new MatTableDataSource<Product>(this.displayProducts);
        this.dataSource.paginator = this.paginator;
      },
      error => console.log(error)
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
    this.filterGroup.reset()
    this.displayProducts = this.products;
    this.dataSource = new MatTableDataSource<Product>(this.displayProducts);
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


  resumeProduct(product: Product) {
    this.productService.resumeProduct(product.id || '').subscribe(
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
      },
      error => {
        console.log(error);
        this.onFailure('重新启用');
      }
    )
  }
}
