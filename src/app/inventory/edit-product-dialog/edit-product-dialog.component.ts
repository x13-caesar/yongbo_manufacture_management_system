import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Product} from '../../shared/models/product';
import {ProductService} from '../../shared/http-services/product.service';

class DialogData {
  product!: Product
}

@Component({
  selector: 'app-edit-product-dialog',
  templateUrl: './edit-product-dialog.component.html',
  styleUrls: ['./edit-product-dialog.component.scss']
})
export class EditProductDialogComponent implements OnInit {
  productGroup!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.productGroup = this.formBuilder.group({
      id: new FormControl(this.data.product.id, Validators.required),
      name: new FormControl(this.data.product.name, Validators.required),
      category: new FormControl(this.data.product.category, Validators.required),
      description: new FormControl(this.data.product.description),
      inventory: new FormControl(this.data.product.inventory, Validators.min(0)),
      custom: new FormControl(this.data.product.custom),
      notice: new FormControl(this.data.product.notice),
      picture: new FormControl(this.data.product.picture)
    });
  }

  onProductInfoConfirm(form: FormGroup) {
    const updated_prod: Product = {...this.data.product, ...form.value};
    this.productService.putProduct(updated_prod).subscribe(
      ret_prod => this.dialogRef.close(ret_prod),
      error => this.onFailure('更新产品信息')
    );
  }

  onFailure(eventString: string): void {
    this._snackBar.open(`${eventString}失败`, "关闭");
  }
}
