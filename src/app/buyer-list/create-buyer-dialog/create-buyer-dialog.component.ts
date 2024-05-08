import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BuyerService} from '../../shared/http-services/buyer.service';

@Component({
  selector: 'app-create-buyer-dialog',
  templateUrl: './create-buyer-dialog.component.html',
  styleUrls: ['./create-buyer-dialog.component.scss']
})
export class CreateBuyerDialogComponent implements OnInit {
  buyerGroup!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateBuyerDialogComponent>,
    private formBuilder: FormBuilder,
    private buyerService: BuyerService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.buyerGroup = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      company: new FormControl('', Validators.required),
      contact: new FormControl(''),
      payment_period: new FormControl(''),
      address: new FormControl(''),
      notice: new FormControl('')
    });
  }

  onSubmit(form: FormGroup): void {
    const newBuyer = form.value;
    this.buyerService.postBuyer(newBuyer).subscribe(
      res => {
        this.dialogRef.close(res)
      },
      error => {
        console.log(error);
        this.onFailure();
      }
    )
  }

  onFailure(): void {
    this._snackBar.open(`创建失败`, "关闭");
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
