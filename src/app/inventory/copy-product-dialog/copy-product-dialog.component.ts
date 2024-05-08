import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Product} from '../../shared/models/product';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProductService} from '../../shared/http-services/product.service';
import {Router} from '@angular/router';

class DialogData {
  product!: Product
}

@Component({
  selector: 'app-copy-product-dialog',
  templateUrl: './copy-product-dialog.component.html',
  styleUrls: ['./copy-product-dialog.component.scss']
})
export class CopyProductDialogComponent implements OnInit {
  new_id = new FormControl(null, [Validators.required, Validators.maxLength(16), Validators.pattern('[a-zA-Z0-9]*')]);
  new_prod!: Product;

  constructor(
    public dialogRef: MatDialogRef<CopyProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public _snackBar: MatSnackBar,
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.new_prod = this.data.product;
  }

  onProductCopyConfirm() {
    this.productService.postProduct({...this.data.product, id: this.new_id.value}).subscribe(
      res => this.dialogRef.close(res),
      error => this.onFailure('复制产品')
    );
  }


  onFailure(eventString: string): void {
    this._snackBar.open(`${eventString}失败`, "关闭");
  }

  onDetailInfoEdit() {
    this.router.navigateByUrl(`/copy-product/${this.data.product.id}/${this.new_id.value}`);
    this.dialogRef.close();
  }
}
