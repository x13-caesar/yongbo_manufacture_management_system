import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {ProductCategory} from '../../shared/models/product-category';
import {existingIdValidator} from '../../shared/existing-id.directive';
import {Product} from '../../shared/models/product';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProductService} from '../../shared/http-services/product.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProductCategoryService} from '../../shared/http-services/product-category.service';

class DialogData {
  category_names!: string[]
}

@Component({
  selector: 'app-add-product-category-dialog',
  templateUrl: './add-product-category-dialog.component.html',
  styleUrls: ['./add-product-category-dialog.component.scss']
})
export class AddProductCategoryDialogComponent implements OnInit {

  category!: FormControl;

  constructor(
    public dialogRef: MatDialogRef<AddProductCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private productCategoryService: ProductCategoryService,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.category = new FormControl('', [Validators.required, existingIdValidator(this.data.category_names)])
  }

  onSubmit() {
    const new_product_category: ProductCategory = {
      category: this.category.value,
    }
    this.productCategoryService.postProductCategory(new_product_category).subscribe(
      res => {
        this.dialogRef.close(res)
      },
      error => {
        console.log(error)
        this.onFailure('添加')
      }
    );
  }

  onFailure(eventString: string): void {
    this._snackBar.open(`${eventString}失败`, "关闭");
  }

}
