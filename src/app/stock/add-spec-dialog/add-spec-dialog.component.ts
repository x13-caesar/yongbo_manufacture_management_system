import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {SpecService} from '../../shared/http-services/spec.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {JWTTokenService} from '../../shared/http-services/jwt-token.service';
import {Compo} from '../../shared/models/compo';
import {map} from 'rxjs/operators';
import {Vendor} from '../../shared/models/vendor';
import {CreateVendorDialogComponent} from '../../vendor-list/create-vendor-dialog/create-vendor-dialog.component';
import {environment} from '../../../environments/environment';
import {VendorService} from '../../shared/http-services/vendor.service';
import {Observable} from 'rxjs';
import {Spec} from '../../shared/models/spec';
import {existingIdValidator} from '../../shared/existing-id.directive';

class DialogData {
  compo!: Compo;
  specs!: Spec[];
}

@Component({
  selector: 'app-add-spec-dialog',
  templateUrl: './add-spec-dialog.component.html',
  styleUrls: ['./add-spec-dialog.component.scss']
})
export class AddSpecDialogComponent implements OnInit {
  specGroup!: FormGroup;
  existingSpecIds: string[] = [];

  vendors: Vendor[] = [];
  vendorOptions!: Observable<Vendor[]>;
  selectedVendor = new FormControl(null, Validators.required);

  constructor(
    public dialogRef: MatDialogRef<AddSpecDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private specService: SpecService,
    public vendorService: VendorService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public jwtTokenService: JWTTokenService
  ) { }


  ngOnInit(): void {
    this.data.specs.forEach(spec => this.existingSpecIds.push(spec.id!));
    this.specGroup = this.formBuilder.group({
      id: new FormControl('', [Validators.required, existingIdValidator(this.existingSpecIds)]),
      gross_price: new FormControl('', [Validators.required, Validators.min(0)]),
      net_price: new FormControl('', [Validators.required, Validators.min(0)]),
      stock: new FormControl(0, [Validators.min(0), Validators.required]),
      blueprint: new FormControl(''),
      notice: new FormControl('')
    });
    this.vendorService.getVendors().subscribe(
      res => this.vendors = res,
      error => console.log(error)
    );
    this.vendorOptions = this.selectedVendor.valueChanges
      .pipe(
        map(v => this.vendorService.vendorAutocompleteFilter(this.vendors, v))
      );
  }

  onSpecSubmit(form: FormGroup): void {
    const spec = form.value;
    spec['component_id'] = this.data.compo.id;
    spec['vendor_id'] = this.selectedVendor.value.id;
    this.specService.postSpec(form.value).subscribe(
      new_spec => {
        new_spec.vendor = this.selectedVendor.value;
        this.dialogRef.close(new_spec);
      },
      error => {
        this._snackBar.open(error.error.detail, "关闭");
        console.log(error);
      }
    );
  }

  openCreateVendorDialog(): void {
    const dialogRef = this.dialog.open(CreateVendorDialogComponent, {
      width: environment.MEDIAN_DIALOG_WIDTH
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vendors.push(result);
      }
    });
  }

  onSuccess(obj: string): void {
    this._snackBar.open(`创建${obj}成功`, "关闭");
  }

  onFailure(obj: string): void {
    this._snackBar.open(`创建${obj}失败`, "关闭");
  }

  generateSpecId() {
    const new_id = this.data.compo.id + this.selectedVendor.value.id.toString().padStart(3, '0');
    this.specGroup.controls['id'].setValue(new_id);
  }
}
