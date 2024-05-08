import {Component, Inject, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {map} from 'rxjs/operators';
import {Delivery} from '../../shared/models/delivery';
import {Product} from '../../shared/models/product';
import {ProductService} from '../../shared/http-services/product.service';
import {Buyer} from '../../shared/models/buyer';
import {DeliveryService} from '../../shared/http-services/delivery.service';
import {BuyerService} from '../../shared/http-services/buyer.service';
import {Router} from '@angular/router';
import {UtilService} from '../../shared/util.service';

class DialogData {
  product!: Product
}

@Component({
  selector: 'app-create-delivery-dialog',
  templateUrl: './create-delivery-dialog.component.html',
  styleUrls: ['./create-delivery-dialog.component.scss']
})
export class CreateDeliveryDialogComponent implements OnInit {
  buyers: Buyer[] = [];
  buyerOptions!: Observable<Buyer[]>;

  products: Product[] = [];
  productOptions!: Observable<Product[]>;

  deliveryGroup!: FormGroup;
  totalPrice = new FormControl(0);

  constructor(
    public dialogRef: MatDialogRef<CreateDeliveryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private deliveryService: DeliveryService,
    private buyerService: BuyerService,
    private router: Router,
    public productService: ProductService,
    public _snackBar: MatSnackBar,
    public utilService: UtilService
  ) { }

  ngOnInit(): void {
    this.deliveryGroup = this.formBuilder.group({
      product: new FormControl(this.data ? this.data.product.id : null, Validators.required),
      amount: new FormControl(0,
        [Validators.required, Validators.min(0)]),
      order_id: new FormControl(''),
      buyer_id: new FormControl('', Validators.required),
      deliver_date: new FormControl(new Date(), Validators.required),
      unit_price: new FormControl(0, [Validators.required, Validators.min(0)]),
      // total_price: new FormControl(0, [Validators.required, Validators.min(0)]),
      notice: new FormControl('')
    });
    if (!this.data.product) {
      this.productService.getProducts().subscribe(
        res => this.products = res
      )
    };
    this.buyerService.getBuyers().subscribe(
      res => this.buyers = res,
      error => console.log(error)
    );
    this.buyerOptions = this.deliveryGroup.controls['buyer_id'].valueChanges.pipe(
      map(input => this.buyerAutocompleteFilter(String(input) || '')));
    this.deliveryGroup.controls['amount'].setValidators(
      [Validators.required, Validators.min(0), Validators.max(this.data.product.inventory || 0)])
    this.deliveryGroup.valueChanges.subscribe(
      changes => this.totalPrice.setValue(changes['unit_price'] * changes['amount'])
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  buyerAutocompleteFilter(value: string): Buyer[] {
    return this.buyers.filter(b => b.company.includes(value) || b.name.includes(value));
  }

  buyerDisplayFn(b: Buyer): string {
    return b && `${b.company} | ${b.name}`;
  }

  onDeliveryConfirm(form: FormGroup): void {
    const new_delivery: Delivery = {
      ...form.value,
      product_id: this.data.product.id,
      deliver_date: this.utilService.getTimeStringAsUTC(form.value.deliver_date),
      buyer_id: form.value.buyer_id.id,
      total_price: this.totalPrice.value};
    this.deliveryService.postDelivery(new_delivery).subscribe(
      res => {
      },
      error => this.onFailure()
    )
  }

  onSuccess(): void {
    this._snackBar.open(`创建成功`, "关闭");
  }

  onFailure(): void {
    this._snackBar.open(`创建失败`, "关闭");
  }

}
