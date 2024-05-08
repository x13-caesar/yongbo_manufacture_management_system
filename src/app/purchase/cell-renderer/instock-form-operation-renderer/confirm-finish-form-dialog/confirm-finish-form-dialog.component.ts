import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {VendorService} from '../../../../shared/http-services/vendor.service';
import {JWTTokenService} from '../../../../shared/http-services/jwt-token.service';
import {WorkService} from '../../../../shared/http-services/work.service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {InstockForm, InstockItem} from '../../../../shared/models/instock';
import {environment} from '../../../../../environments/environment';
import {autoFadeSnackBar} from '../../../../shared/util/notifications';

@Component({
  selector: 'app-confirm-finish-form-dialog',
  templateUrl: './confirm-finish-form-dialog.component.html',
  styleUrls: ['./confirm-finish-form-dialog.component.scss']
})
export class ConfirmFinishFormDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmFinishFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public instock_form: InstockForm,
    public vendorService: VendorService,
    public jwtTokenService: JWTTokenService,
    private dialog: MatDialog,
    private workService: WorkService,
    private http: HttpClient,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.http.get<InstockItem[]>(`${environment.API_URL}/instock/enriched_item?form_id=${this.instock_form.form_id}`).subscribe({
      next: (instock_items ) => {
        this.instock_form.instock_item = instock_items;
        console.log(instock_items)
      },
      error: (error: Error) => {
        this._snackBar.open(error.message);
      }
    })
  }

  onConfirmFinish() {
    this.http.put<InstockForm>(
      `${environment.API_URL}/instock/form`,
      {...this.instock_form, form_status: "finished"}).subscribe({
      next: (updated_instock ) => {
        autoFadeSnackBar(this._snackBar, "采购单状态更新成功", 3000);
        this.dialogRef.close(updated_instock);
      },
      error: (error: Error) => {
        this._snackBar.open(error.message);
      }
    })
  }

}
