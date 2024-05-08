import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BatchProcess} from '../../shared/models/batch-process';
import {Employee} from '../../shared/models/employee';
import {Work} from '../../shared/models/work';
import {WarehouseRecord} from '../../shared/models/warehouse-record';
import {UtilService} from '../../shared/util.service';

class DialogData {
  work!: Work;
  warehouse_record!: WarehouseRecord[];
  max_amount!: number
}

@Component({
  selector: 'app-edit-work-dialog',
  templateUrl: './edit-work-dialog.component.html',
  styleUrls: ['./edit-work-dialog.component.scss']
})
export class EditWorkDialogComponent implements OnInit {
  workSpecGroup = new FormGroup({});
  work_date = new FormControl(
    null,
    Validators.required);
  plan_unit = new FormControl(
    0,
    [Validators.required, Validators.max(this.data.max_amount), Validators.min(1)]
  )


  constructor(
    public dialogRef: MatDialogRef<EditWorkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public util: UtilService
  ) { }

  ngOnInit(): void {
    this.work_date.setValue(this.data.work.work_date);
    this.plan_unit.setValue(this.data.work.plan_unit);
    this.data.work.work_specification?.forEach(
      ws => this.workSpecGroup.addControl(
        ws.specification_id,
        this.formBuilder.control(
          ws.actual_amount,
          [Validators.required, Validators.min(0)]))
    );
    this.plan_unit.valueChanges.subscribe(value => this.data.warehouse_record?.forEach(
      wr => this.workSpecGroup.controls[wr.specification_id].setValidators(
        [Validators.required, Validators.min(0), Validators.max(value * wr.consumption * 1.1)])
    ));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    this.data.work.plan_unit = this.plan_unit.value;
    this.data.work.work_date = this.work_date.value;
    this.data.work.work_specification?.forEach(ws =>{
      ws.plan_amount = this.plan_unit.value;
      ws.actual_amount = this.workSpecGroup.controls[ws.specification_id].value;
    });
    this.dialogRef.close(this.data.work);
  }
}
