import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Compo} from '../../shared/models/compo';
import {CompoService} from '../../shared/http-services/compo.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {autoFadeSnackBar} from '../../shared/util/notifications';

class DialogData {
  compo!: Compo
}

@Component({
  selector: 'app-edit-component-dialog',
  templateUrl: './edit-component-dialog.component.html',
  styleUrls: ['./edit-component-dialog.component.scss']
})
export class EditComponentDialogComponent implements OnInit {
  compoGroup!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditComponentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private compoService: CompoService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    console.log(this.data.compo);
    this.compoGroup = this.formBuilder.group({
      id: {value: this.data.compo.id, disabled: true},
      name: new FormControl(this.data.compo.name, Validators.required),
      category: new FormControl(this.data.compo.category, Validators.required),
      model: new FormControl(this.data.compo.model),
      description: new FormControl(this.data.compo.description),
      expiration: new FormControl(this.data.compo.expiration),
      unit_weight: new FormControl(this.data.compo.unit_weight),
      fill_period: new FormControl(this.data.compo.fill_period),
      warn_stock: new FormControl(this.data.compo.warn_stock, Validators.min(0)),
      notice: new FormControl(this.data.compo.notice),
      as_unit: new FormControl(this.data.compo.as_unit),
      picture: new FormControl(this.data.compo.picture)
    });
  }

  onCompoInfoConfirm(form: FormGroup): void {
    const updated_compo: Compo = {...form.value};
    updated_compo.id = this.data.compo.id;
    this.compoService.putCompo(updated_compo).subscribe(
      {
        next: res => {this.dialogRef.close(updated_compo);},
        error: error => {autoFadeSnackBar(this._snackBar, '配件信息修改', 3000);
    }
  }
    )
  }

}
