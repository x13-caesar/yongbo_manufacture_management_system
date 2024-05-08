import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Product} from '../../shared/models/product';
import {MatTableDataSource} from '@angular/material/table';
import {ProductService} from '../../shared/http-services/product.service';
import {MatSnackBar} from '@angular/material/snack-bar';

class DialogData {
  product!: Product
}

@Component({
  selector: 'app-confirm-deprecate-dialog',
  templateUrl: './confirm-deprecate-dialog.component.html',
  styleUrls: ['./confirm-deprecate-dialog.component.scss']
})
export class ConfirmDeprecateDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeprecateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private productService: ProductService,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }


  onDeprecateConfirm() {
    this.productService.deprecateProduct(this.data.product.id || '').subscribe(
      res => {
        res.success && this.dialogRef.close('success')
      },
      error => {
        console.log(error)
        this.onFailure('停用')
      }
    );
  }

  onFailure(eventString: string): void {
    this._snackBar.open(`${eventString}失败`, "关闭");
  }
}
