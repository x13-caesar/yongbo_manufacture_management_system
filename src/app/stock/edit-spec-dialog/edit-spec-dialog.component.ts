import {Component, Inject, OnInit} from '@angular/core';
import {Vendor} from '../../shared/models/vendor';
import {Observable} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SpecService} from '../../shared/http-services/spec.service';
import {Spec} from '../../shared/models/spec';
import {MatSnackBar} from '@angular/material/snack-bar';
import {JWTTokenService} from '../../shared/http-services/jwt-token.service';
import {validate} from 'codelyzer/walkerFactory/walkerFn';

class DialogData {
  spec!: Spec;
  compo_name!: string;
}

@Component({
  selector: 'app-edit-spec-dialog',
  templateUrl: './edit-spec-dialog.component.html',
  styleUrls: ['./edit-spec-dialog.component.scss']
})
export class EditSpecDialogComponent implements OnInit {
  specGroup!: FormGroup;

  vendors: Vendor[] = [];
  vendorOptions!: Observable<Vendor[]>;
  selectedVendor = new FormControl('', Validators.required);


  constructor(
    public dialogRef: MatDialogRef<EditSpecDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private specService: SpecService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public jwtTokenService: JWTTokenService
  ) { }

  ngOnInit(): void {
    this.specGroup = this.formBuilder.group({
      id: new FormControl({value:'', disabled: true}, Validators.required),
      vendor_id: new FormControl(null),
      component_id: new FormControl(''),
      gross_price: new FormControl(''),
      net_price: new FormControl(''),
      use_net: new FormControl(false, Validators.required),
      stock: new FormControl(0, Validators.required),
      unit_amount: new FormControl(null),
      notice: new FormControl(''),
    });
    if (this.data.spec) {
      const spec_data = this.data.spec;
      delete spec_data.vendor;
      delete spec_data.vendor_company;
      delete spec_data.component_name;
      this.specGroup.setValue(spec_data);
    }
  }

  onSpecInfoConfirm(form: FormGroup): void {
    const updated_spec = {...this.data.spec, ...form.value};
    this.specService.putSpec(updated_spec).subscribe(
      {next: res =>
    {
      this.dialogRef.close(res);
    }
  ,
    error: error => {
      this.onFailure('规格信息修改');
      console.log(error);
    }
  }
    );
  }


  onFailure(eventString: string): void {
    this._snackBar.open(`${eventString}失败`, "关闭");
  }

}
