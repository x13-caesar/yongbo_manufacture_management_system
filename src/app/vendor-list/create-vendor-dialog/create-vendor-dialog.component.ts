import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {VendorService} from '../../shared/http-services/vendor.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Vendor} from '../../shared/models/vendor';

@Component({
  selector: 'app-create-vendor-dialog',
  templateUrl: './create-vendor-dialog.component.html',
  styleUrls: ['./create-vendor-dialog.component.scss']
})
export class CreateVendorDialogComponent implements OnInit {

  vendorGroup!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateVendorDialogComponent>,
    private formBuilder: FormBuilder,
    private vendorService: VendorService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.vendorGroup = this.formBuilder.group({
      name: [null, Validators.required],
      company: [null, Validators.required],
      contact: [null],
      email: [null],
      fax: [null],
      address: [null],
      payment_period: [null],
      notice: [null]
    });
  }

  onSubmit(form: FormGroup): void {
    const newVendor = form.value;
    this.vendorService.postVendor(newVendor).subscribe(
      {
        next: res => {this.dialogRef.close(res);},
        error: error => {
          alert(error.message);
          this.onFailure();
        }
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
