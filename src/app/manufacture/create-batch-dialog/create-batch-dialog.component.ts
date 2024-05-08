import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Batch} from '../../shared/models/batch';
import {ProductService} from '../../shared/http-services/product.service';
import {Product} from '../../shared/models/product';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {BatchService} from '../../shared/http-services/batch.service';
import {BatchProcessService} from '../../shared/http-services/batch-process.service';
import {ProcessService} from '../../shared/http-services/process.service';
import {Process} from '../../shared/models/process';
import {BatchProcess} from '../../shared/models/batch-process';
import {UtilService} from '../../shared/util.service';
import {existingProductValidator} from '../../shared/existing-id.directive';

class DialogData {
}

@Component({
  selector: 'app-create-batch-dialog',
  templateUrl: './create-batch-dialog.component.html',
  styleUrls: ['./create-batch-dialog.component.scss']
})
export class CreateBatchDialogComponent implements OnInit {
  batchGroup!: FormGroup;
  products: Product[] = [];
  productOptions!: Observable<Product[]>;
  returnBatch: Batch | null = null;
  loadingFlag: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CreateBatchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private batchService: BatchService,
    public _snackBar: MatSnackBar,
    public utilService: UtilService
  ) { }

  ngOnInit(): void {
    this.loadingFlag = true;
    this.productService.getValidProducts().subscribe(
      res => {
        this.products = res;
        this.batchGroup.controls["product"].setValidators([Validators.required, existingProductValidator(res)]);
        this.loadingFlag = false;
      },
      error => console.log(error))
    this.batchGroup = this.formBuilder.group({
      product: new FormControl(null, ),
      plan_amount: new FormControl(null, [Validators.required, Validators.min(1)]),
      start: new FormControl('', Validators.required),
      notice: new FormControl('')
    })
    this.productOptions = this.batchGroup.controls['product'].valueChanges.pipe(
      map(input => this.productAutocompleteFilter(input)));
  }

  productAutocompleteFilter(input: string): Product[] {
    return this.products.filter(p => p.name.includes(input) || String(p.id).startsWith(input))
  }

  productDisplayFn(product: Product): string {
    return product ? `${product.name} | ${product.id}` : ''
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onBatchSubmit(form: FormGroup): void {
    const now = this.utilService.getTimeStringAsUTC(new Date());
    const product_name = form.value.product.name;
    const new_batch: Batch = {...form.value, start: this.utilService.getTimeStringAsUTC(form.value.start), product_id: form.value.product.id};
    new_batch.create = now;
    new_batch.status = new_batch.start > now ? 'unstarted' : 'ongoing'
    this.batchService.postBatch(new_batch).subscribe(
      returnBatch => {
        this.onSuccess('创建生产批次');
        console.log(returnBatch);
        this.dialogRef.close({...returnBatch, product_name: product_name});
        },
        error => {console.log(error); this.onFailure('创建生产批次');});
  }

  onSuccess(eventString: string): void {
    this._snackBar.open(`${eventString}成功`, "关闭");
  }

  onFailure(eventString: string): void {
    this._snackBar.open(`${eventString}失败`, "关闭");
  }

}
